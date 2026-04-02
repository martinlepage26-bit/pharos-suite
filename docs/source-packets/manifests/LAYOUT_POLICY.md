# Source-Packets Layout Policy

1. Preserve incoming packet content as-is in archive form.
2. Do not create expanded nested extraction trees inside the repo by default.
3. Keep exactly three control artifacts here: archive files, manifests, and packet registry.
4. If extraction is required for a specific task, do it in temporary workspace outside `docs/source-packets` and discard after use.
