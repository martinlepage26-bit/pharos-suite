// COMPASSai — Cloudflare Worker entry point
// Source: Spec 06 (governance), Spec 10 (release guardrails)
// TODO (full build): wire handoff receiver → governance engine → deliverables

export default {
  async fetch(
    _request: Request,
    _env: Env,
    _ctx: ExecutionContext
  ): Promise<Response> {
    // TODO: route to handleGovernance
    return new Response("COMPASSai — not yet implemented", { status: 503 });
  },
};

interface Env {
  AURORA_DB: D1Database;
  AURORA_FILES: R2Bucket;
}
