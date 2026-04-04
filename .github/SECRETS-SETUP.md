# GitHub Actions Secrets Setup

## Required Secrets

Add these in **GitHub → Settings → Secrets and variables → Actions**:

| Secret Name | Value |
|-------------|-------|
| `CLOUDFLARE_API_TOKEN` | `RTW36072sCkxx8bVgrEgNQ7r_sdhazeSrWLukUZl` |
| `CLOUDFLARE_ACCOUNT_ID` | `1713c51cc6fbcf8d7143526b93495b76` |

## Steps

1. Go to: `https://github.com/martinlepage26-bit/pharos-suite/settings/secrets/actions`
2. Click **"New repository secret"**
3. Add each secret above
4. Push to main → workflow auto-runs

## Token Permissions

The API token needs:
- `Cloudflare Workers: Edit`
- `Account-level API Tokens: Edit`
