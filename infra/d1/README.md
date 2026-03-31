# D1 Migrations

This directory holds implementation-ready D1 SQL for the simplified `govern_suite` storage model.

The schema is designed to preserve the InfraFabric processing logic and the same claim-boundary discipline used across Govern AI, AurorA, and CompassAI.

## Current files

- `001_init_govern_suite.sql`

## Purpose

These migrations preserve:

- recursive processing runs
- recursive governance cycles
- reassessment lineage
- evidence package versioning
- append-only audit history

They also preserve the fail-closed posture:

- incomplete lineage does not become a stronger state by inference
- missing evidence keeps review states provisional
- package creation does not stand in for governance completion

## Apply later

When we are ready to stand up `D1`, the first apply target is:

```bash
wrangler d1 create govern_suite
wrangler d1 execute govern_suite --file=infra/d1/001_init_govern_suite.sql
```

Do not run this yet unless the Cloudflare D1 resource already exists and we are ready to start the storage migration.
