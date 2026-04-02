# PHAROS Email Infrastructure

Updated: 2026-03-30

## Scope

- Zone: `pharos-ai.ca`
- Sending provider: Resend
- Receiving provider: Cloudflare Email Routing
- Forward destination: `martinlepage.ai@gmail.com`
- Mailbox model: forwarding only; no traditional hosted mailbox
- Webhook model: none

## Sending

- Resend domain: `pharos-ai.ca`
- Resend status: `verified`
- Approved sender addresses:
  - `pharos@pharos-ai.ca`
  - `consult@pharos-ai.ca`
  - `ml@pharos-ai.ca`

Resend-related DNS:

- `send.pharos-ai.ca` MX -> `feedback-smtp.us-east-1.amazonses.com` (priority `10`)
- `send.pharos-ai.ca` TXT -> `v=spf1 include:amazonses.com ~all`
- `resend._domainkey.pharos-ai.ca` TXT -> Resend DKIM public key

## Receiving

- Cloudflare Email Routing: enabled
- Zone status: `ready`
- Verified destination address: `martinlepage.ai@gmail.com`

Forwarding rules:

- `pharos@pharos-ai.ca` -> `martinlepage.ai@gmail.com`
- `consult@pharos-ai.ca` -> `martinlepage.ai@gmail.com`
- `ml@pharos-ai.ca` -> `martinlepage.ai@gmail.com`

Cloudflare Email Routing DNS:

- `pharos-ai.ca` MX -> `route1.mx.cloudflare.net` (priority `97`)
- `pharos-ai.ca` MX -> `route2.mx.cloudflare.net` (priority `2`)
- `pharos-ai.ca` MX -> `route3.mx.cloudflare.net` (priority `80`)
- `pharos-ai.ca` TXT -> `v=spf1 include:_spf.mx.cloudflare.net ~all`
- `cf2024-1._domainkey.pharos-ai.ca` TXT -> Cloudflare DKIM public key

## DMARC

- `_dmarc.pharos-ai.ca` TXT -> `v=DMARC1; p=none; rua=mailto:martinlepage.ai@gmail.com`

## Verification

- Resend accepted send tests for:
  - `pharos@pharos-ai.ca`
  - `consult@pharos-ai.ca`
  - `ml@pharos-ai.ca`
- Cloudflare destination verification completed for `martinlepage.ai@gmail.com`
- Manual inbound forwarding test completed from Gmail to `pharos@pharos-ai.ca`

## Notes

- Root inbound routing and `send.pharos-ai.ca` bounce handling coexist without DNS conflict.
- Any setup token exposed during migration should be rotated immediately after use.
