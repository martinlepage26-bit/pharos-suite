# PHAROS API + DNS Runbook

Last updated: 2026-03-30

This is the production-facing rollout for the existing local FastAPI backend behind:

- frontend: `https://pharos-ai.ca`
- redirects:
  - `https://www.pharos-ai.ca` -> `https://pharos-ai.ca`
  - `https://pharos-suite.ca` -> `https://pharos-ai.ca`
  - `https://www.pharos-suite.ca` -> `https://pharos-ai.ca`
- API: `https://api.pharos-ai.ca`

Preview-only note:

- No active PHAROS preview Pages or preview backend surface exists as of 2026-03-30.
- `pharos-preview-backend-runbook.md` is retained only as a retired historical note.

Mail note:

- PHAROS mail DNS and routing for `pharos@`, `consult@`, and `ml@pharos-ai.ca` are documented separately in `/home/cerebrhoe/PHAROS-SUITE/repos/pharos-suite/EMAIL-INFRA.md`.

## 1. Cloudflare Pages hostnames

Canonical state:

- PHAROS production Pages project: `pharos-suite`
- No active PHAROS preview Pages project
- PHAROS public hostname: `https://pharos-ai.ca`

Controlled hostname cutover:

- attach `pharos-ai.ca` as the canonical public hostname on `pharos-suite`
- attach `www.pharos-ai.ca` and redirect it to `https://pharos-ai.ca`
- attach `pharos-suite.ca` and `www.pharos-suite.ca` only if you intentionally preserve them as redirect-only legacy PHAROS hostnames
- do not attach external non-PHAROS hostnames to the PHAROS Pages project

## 2. Install `cloudflared` on the backend machine

Ubuntu or WSL:

```bash
curl -L https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb -o /tmp/cloudflared.deb
sudo dpkg -i /tmp/cloudflared.deb
cloudflared --version
```

## 3. Authenticate and create the tunnel

```bash
cloudflared tunnel login
cloudflared tunnel create pharos-api
```

## 4. Publish `api.pharos-ai.ca`

```bash
cloudflared tunnel route dns pharos-api api.pharos-ai.ca
```

Create `~/.cloudflared/config.yml`:

```yaml
tunnel: pharos-api
credentials-file: /home/cerebrhoe/.cloudflared/<TUNNEL_ID>.json

ingress:
  - hostname: api.pharos-ai.ca
    service: http://127.0.0.1:9202
  - service: http_status:404
```

Then run:

```bash
cloudflared tunnel run pharos-api
```

## 5. Backend environment

Set:

```bash
export CORS_ORIGINS="https://pharos-ai.ca,https://www.pharos-ai.ca,https://pharos-suite.ca,https://www.pharos-suite.ca,https://pharos-suite.pages.dev"
export SENDER_EMAIL="pharos@pharos-ai.ca"
```

Keep the existing required backend secrets in place too:

- `ADMIN_PASSPHRASE`
- `MONGO_URL`
- `DB_NAME`
- `RESEND_API_KEY`
- `ADMIN_EMAILS`

## 6. Frontend environment

In Cloudflare Pages production variables, set:

```txt
REACT_APP_BACKEND_URL=https://api.pharos-ai.ca
```

Then trigger a production deploy:

```bash
cd /home/cerebrhoe/PHAROS-SUITE/repos/pharos-suite/frontend
npm run cf:deploy
```

## 7. Verification

After DNS and tunnel propagation:

```bash
curl https://api.pharos-ai.ca/health
curl https://api.pharos-ai.ca/api/health
```

Then verify in the browser:

- ~~`https://pharos-ai.ca/admin`~~ <!-- DEPRECATED: this path no longer resolves; original target was the PHAROS admin login route -->
- `https://pharos-ai.ca/about`
- `https://pharos-ai.ca/observatory`
- `https://pharos-ai.ca/services`
- `https://www.pharos-ai.ca` redirects to `https://pharos-ai.ca`
- `https://pharos-suite.ca` redirects to `https://pharos-ai.ca`

## 8. Important note

If the backend machine sleeps, loses internet, or the local stack stops, `api.pharos-ai.ca` will fail. This tunnel is a bridge, not the final uptime architecture.

## 9. Tunnel failover and recovery procedure

### 9a. Check tunnel health

```bash
cloudflared tunnel info pharos-api
```

If the tunnel shows no active connections, the backend is unreachable at the edge.

### 9b. Restart the tunnel

```bash
# Start the tunnel in the foreground (use screen/tmux to keep it alive):
cloudflared tunnel run pharos-api

# Or run as a background service (Linux systemd):
sudo systemctl restart cloudflared
```

### 9c. Find the active tunnel ID and credential file

```bash
cloudflared tunnel list
# Note the ID column for pharos-api — credentials file is at:
# ~/.cloudflared/<TUNNEL_ID>.json
```

Keep a copy of `~/.cloudflared/<TUNNEL_ID>.json` and `~/.cloudflared/config.yml` in a secure offline backup. Loss of the credential file requires creating a new tunnel and updating the DNS CNAME in Cloudflare.

### 9d. Rotate tunnel credentials (if credential file is lost or compromised)

```bash
# Delete the old tunnel:
cloudflared tunnel delete pharos-api

# Create a new one:
cloudflared tunnel create pharos-api

# Update config.yml with the new tunnel ID:
# credentials-file: /home/cerebrhoe/.cloudflared/<NEW_TUNNEL_ID>.json

# Update the Cloudflare DNS CNAME for api.pharos-ai.ca to the new tunnel address:
# <NEW_TUNNEL_ID>.cfargotunnel.com
```

After credential rotation, redeploy the CF Worker (`npm run cf:api:deploy` from repo root) so `LEGACY_API_ORIGIN` still resolves correctly.

### 9e. Verify recovery

```bash
curl https://api.pharos-ai.ca/health
# Expected: {"ok":true, "mode":"proxy_foundation", ...}
```

### 9f. Tunnel availability monitoring (manual)

No automated alerting is currently configured. Until a monitoring solution is in place, check tunnel health manually before sessions where the API is expected to be live.
