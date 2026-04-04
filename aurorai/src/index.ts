// AurorA — Cloudflare Worker entry point
// Source: Spec 03 (intake), Spec 10 (release guardrails)
// TODO (full build): wire intake → extraction → handoff pipeline

export default {
  async fetch(
    _request: Request,
    _env: Env,
    _ctx: ExecutionContext
  ): Promise<Response> {
    // TODO: route to handleIntake
    return new Response("AurorA — not yet implemented", { status: 503 });
  },
};

// TODO: define Env bindings once wrangler.toml is confirmed
interface Env {
  AURORA_FILES: R2Bucket;   // TODO: confirm binding name from d1-r2-endpoint-mapping.md
  AURORA_DB: D1Database;    // TODO: confirm binding name
}
