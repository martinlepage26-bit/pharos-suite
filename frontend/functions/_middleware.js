const CANONICAL_HOSTNAME = "pharos-ai.ca";
const REDIRECT_HOSTNAMES = new Set([
  "www.pharos-ai.ca",
  "govern-ai.ca",
  "www.govern-ai.ca",
]);
const PROTECTED_PATHS = new Set([
  "/normalized-results",
  "/normalized-results.html",
  "/tracker_dashboard.js",
]);
const BASIC_AUTH_REALM = 'PHAROS normalized results';

function parseBasicAuth(headerValue) {
  if (!headerValue || !headerValue.startsWith("Basic ")) {
    return null;
  }

  try {
    const decoded = atob(headerValue.slice(6));
    const separator = decoded.indexOf(":");
    if (separator === -1) return null;
    return {
      username: decoded.slice(0, separator),
      password: decoded.slice(separator + 1),
    };
  } catch {
    return null;
  }
}

function secureEquals(a, b) {
  if (typeof a !== "string" || typeof b !== "string") return false;
  if (a.length !== b.length) return false;

  let mismatch = 0;
  for (let i = 0; i < a.length; i += 1) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

function unauthorizedResponse() {
  return new Response("Authentication required.", {
    status: 401,
    headers: {
      "WWW-Authenticate": `Basic realm="${BASIC_AUTH_REALM}", charset="UTF-8"`,
      "Cache-Control": "no-store",
    },
  });
}

export async function onRequest(context) {
  const url = new URL(context.request.url);

  if (REDIRECT_HOSTNAMES.has(url.hostname)) {
    url.protocol = "https:";
    url.hostname = CANONICAL_HOSTNAME;
    return Response.redirect(url.toString(), 308);
  }

  if (PROTECTED_PATHS.has(url.pathname)) {
    const requiredUsername = context.env.NORMALIZED_RESULTS_LOGIN;
    const requiredPassword = context.env.NORMALIZED_RESULTS_PASSWORD;

    if (!requiredUsername || !requiredPassword) {
      return new Response("Protected route is not configured.", {
        status: 503,
        headers: { "Cache-Control": "no-store" },
      });
    }

    const parsed = parseBasicAuth(context.request.headers.get("Authorization"));
    if (!parsed) {
      return unauthorizedResponse();
    }

    if (
      !secureEquals(parsed.username, requiredUsername) ||
      !secureEquals(parsed.password, requiredPassword)
    ) {
      return unauthorizedResponse();
    }
  }

  return context.next();
}
