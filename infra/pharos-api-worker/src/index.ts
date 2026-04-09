interface Env {
  LEGACY_API_ORIGIN?: string;
  API_ALLOWED_ORIGINS?: string;
  GOVERN_SUITE?: D1Database;
  GOVERN_ARTIFACTS?: R2Bucket;
  GOVERN_EVIDENCE?: R2Bucket;
  // Workers AI binding — declared in wrangler.jsonc under "ai".
  // Available at runtime on the free tier; no extra configuration needed.
  AI?: Ai;
  // Rate limit binding for admin login — namespace_id must be set in wrangler.jsonc.
  ADMIN_LOGIN_RL?: { limit(opts: { key: string }): Promise<{ success: boolean }> };
}

const DEFAULT_ALLOWED_ORIGINS = [
  "https://pharos-ai.ca",
  "https://www.pharos-ai.ca",
  "https://pharos-suite.ca",
  "https://www.pharos-suite.ca",
  "https://pharos-suite.pages.dev",
];

const SECURITY_HEADERS: Record<string, string> = {
  "content-security-policy": "frame-ancestors 'none'; upgrade-insecure-requests",
  "permissions-policy": "camera=(), geolocation=(), microphone=(), payment=(), usb=()",
  "referrer-policy": "strict-origin-when-cross-origin",
  "strict-transport-security": "max-age=63072000; includeSubDomains; preload",
  "x-content-type-options": "nosniff",
  "x-frame-options": "DENY",
  "x-pharos-surface": "pharos-api-worker-foundation",
};

function createRequestId(): string {
  return crypto.randomUUID();
}

function allowedOrigins(env: Env): string[] {
  return (env.API_ALLOWED_ORIGINS || DEFAULT_ALLOWED_ORIGINS.join(","))
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
}

function withSecurityHeaders(response: Response, requestId: string): Response {
  const updated = new Response(response.body, response);
  for (const [header, value] of Object.entries(SECURITY_HEADERS)) {
    updated.headers.set(header, value);
  }
  updated.headers.set("x-request-id", requestId);
  return updated;
}

function applyCors(response: Response, request: Request, env: Env): Response {
  const updated = new Response(response.body, response);
  const origin = request.headers.get("Origin");
  const allowList = allowedOrigins(env);

  updated.headers.set("Vary", "Origin");
  updated.headers.set("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST");
  updated.headers.set("Access-Control-Allow-Headers", "Authorization,Content-Type,X-Request-ID");
  updated.headers.set("Access-Control-Max-Age", "86400");

  if (origin && allowList.includes(origin)) {
    updated.headers.set("Access-Control-Allow-Origin", origin);
  }

  return updated;
}

function jsonResponse(body: unknown, status: number, requestId: string): Response {
  return withSecurityHeaders(new Response(JSON.stringify(body, null, 2), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
  }), requestId);
}

function healthPayload(env: Env, requestId: string) {
  return {
    ok: true,
    mode: env.LEGACY_API_ORIGIN ? "proxy_foundation" : "foundation_only",
    requestId,
    bindings: {
      legacyApiOriginConfigured: Boolean(env.LEGACY_API_ORIGIN),
      governSuiteBound: Boolean(env.GOVERN_SUITE),
      governArtifactsBound: Boolean(env.GOVERN_ARTIFACTS),
      governEvidenceBound: Boolean(env.GOVERN_EVIDENCE),
    },
  };
}

function proxyTarget(request: Request, env: Env): URL | null {
  if (!env.LEGACY_API_ORIGIN) {
    return null;
  }
  const incoming = new URL(request.url);
  const upstream = new URL(env.LEGACY_API_ORIGIN);
  upstream.pathname = incoming.pathname;
  upstream.search = incoming.search;
  return upstream;
}

// AI_ROUTES: paths where edge intent classification runs before proxying.
// Workers AI classifies the request type so the upstream can skip its own
// routing logic and log intent without an extra LLM call.
const AI_ROUTES = new Set(["/api/compassai/", "/api/aurorai/", "/api/ai/"]);

function isAiRoute(pathname: string): boolean {
  for (const prefix of AI_ROUTES) {
    if (pathname.startsWith(prefix)) return true;
  }
  return false;
}

// Classify the intent of an AI API request at the edge.
// Returns a short label added as X-Pharos-Intent on the upstream request.
// Falls back to "unknown" on any error so the proxy path is never blocked.
async function classifyIntent(request: Request, env: Env): Promise<string> {
  if (!env.AI) return "unknown";

  let body: string;
  try {
    const clone = request.clone();
    const json = await clone.json<{ document_text?: string; contract_text?: string; sector?: string }>();
    const sample = (json.document_text ?? json.contract_text ?? json.sector ?? "").slice(0, 400);
    if (!sample) return "unknown";

    const result = await env.AI.run("@cf/meta/llama-3.3-70b-instruct-fp8-fast", {
      messages: [
        {
          role: "system",
          content:
            "Classify the governance task in one word: " +
            "policy_analysis | contract_analysis | market_intelligence | " +
            "executive_summary | remediation | document_extraction | other. " +
            "Reply with only the label.",
        },
        { role: "user", content: sample },
      ],
    }) as { response?: string };

    return (result.response ?? "unknown").trim().split(/\s+/)[0].slice(0, 64);
  } catch {
    return "unknown";
  }
}

async function proxyLegacyRequest(request: Request, env: Env, requestId: string): Promise<Response> {
  const target = proxyTarget(request, env);
  if (!target) {
    return jsonResponse({
      ok: false,
      code: "LEGACY_UPSTREAM_NOT_CONFIGURED",
      message: "Worker foundation is live, but the legacy upstream is not configured yet.",
      requestId,
    }, 503, requestId);
  }

  const upstreamHeaders = new Headers(request.headers);
  upstreamHeaders.set("x-request-id", requestId);
  upstreamHeaders.delete("host");

  const proxied = new Request(target.toString(), {
    method: request.method,
    headers: upstreamHeaders,
    body: request.method === "GET" || request.method === "HEAD" ? undefined : request.body,
    redirect: "manual",
  });

  const upstreamResponse = await fetch(proxied);
  const response = withSecurityHeaders(new Response(upstreamResponse.body, upstreamResponse), requestId);
  response.headers.set("x-pharos-api-mode", "proxy");
  return response;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const requestId = createRequestId();
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return applyCors(
        withSecurityHeaders(new Response(null, {
          status: 204,
          headers: { "cache-control": "no-store" },
        }), requestId),
        request,
        env,
      );
    }

    if (url.pathname === "/health" || url.pathname === "/api/health") {
      return applyCors(jsonResponse(healthPayload(env, requestId), 200, requestId), request, env);
    }

    if (url.pathname.startsWith("/api/")) {
      // Rate-limit admin login: 5 requests per minute per IP.
      // Requires ADMIN_LOGIN_RL binding with a resolved namespace_id in wrangler.jsonc.
      if (url.pathname === "/api/admin/login" && request.method === "POST" && env.ADMIN_LOGIN_RL) {
        const clientIp = request.headers.get("CF-Connecting-IP") ?? "unknown";
        const { success } = await env.ADMIN_LOGIN_RL.limit({ key: clientIp });
        if (!success) {
          return applyCors(jsonResponse({
            ok: false,
            code: "RATE_LIMITED",
            message: "Too many login attempts. Try again later.",
            requestId,
          }, 429, requestId), request, env);
        }
      }

      // For AI-specific routes, classify intent at the edge and attach it as a
      // header before forwarding. Classification is fire-and-await but never
      // blocks the proxy if Workers AI is unavailable.
      if (isAiRoute(url.pathname) && request.method === "POST" && env.AI) {
        const intent = await classifyIntent(request, env);
        const augmented = new Request(request, {
          headers: new Headers(request.headers),
        });
        augmented.headers.set("X-Pharos-Intent", intent);
        return applyCors(await proxyLegacyRequest(augmented, env, requestId), request, env);
      }
      return applyCors(await proxyLegacyRequest(request, env, requestId), request, env);
    }

    return applyCors(jsonResponse({
      ok: false,
      code: "ROUTE_NOT_FOUND",
      message: "This Worker foundation currently serves PHAROS API routes only.",
      requestId,
    }, 404, requestId), request, env);
  },
};
