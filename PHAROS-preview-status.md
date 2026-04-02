# PHAROS Preview Status

Status snapshot: 2026-03-30

## Current state

- The former frontend preview project `pharos-suite-review` was deleted on 2026-03-30.
- The former preview backend / tunnel path `preview-api.pharos-ai.ca` is retired and should be treated as dead infrastructure.
- There is no supported PHAROS preview deploy path at this time.

## Historical note

Earlier preview verification records from 2026-03-22 remain historically useful for forensic reference only. They do not describe the current live state.

## Operator rule

- Do not use old preview Pages hostnames, preview tunnel hostnames, or deleted project names as if they were still active.
- Do not run legacy preview deployment helpers as part of normal PHAROS operations.
- If preview must return, recreate the Pages project and any required backend path explicitly, then update the docs from fresh live verification.
