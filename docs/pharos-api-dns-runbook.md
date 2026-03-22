# PHAROS API + DNS Runbook

Last updated: 2026-03-13

This is the concrete rollout for publishing the existing local FastAPI backend at:

- frontend: `https://pharos-ai.ca`
- redirects:
  - `https://www.pharos-ai.ca` -> `https://pharos-ai.ca`
  - `https://govern-ai.ca` -> `https://pharos-ai.ca`
  - `https://www.govern-ai.ca` -> `https://pharos-ai.ca`
- API: `https://api.pharos-ai.ca`

## 1. Cloudflare Pages hostnames

In the Cloudflare Pages project that currently serves the PHAROS frontend:

- attach `pharos-ai.ca` as the canonical public hostname
- attach `www.pharos-ai.ca` and redirect it to `https://pharos-ai.ca`
- attach `govern-ai.ca` and `www.govern-ai.ca` only if you intend to preserve legacy PHAROS traffic with redirects
- do not attach `governai.ca` to this project

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
export CORS_ORIGINS="https://pharos-ai.ca,https://www.pharos-ai.ca,https://govern-ai.ca,https://www.govern-ai.ca,https://govern-ai.pages.dev"
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

Then trigger a production deploy.

## 7. Verification

After DNS and tunnel propagation:

```bash
curl https://api.pharos-ai.ca/health
curl https://api.pharos-ai.ca/api/health
```

Then verify in the browser:

- `https://pharos-ai.ca/admin`
- `https://pharos-ai.ca/about`
- `https://pharos-ai.ca/observatory`
- `https://pharos-ai.ca/services`

## 8. Important note

If the backend machine sleeps, loses internet, or the local stack stops, `api.pharos-ai.ca` will fail. This tunnel is a bridge, not the final uptime architecture.
