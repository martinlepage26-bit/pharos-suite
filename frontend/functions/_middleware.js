const CANONICAL_HOSTNAME = "pharos-ai.ca";
const REDIRECT_HOSTNAMES = new Set([
  "www.pharos-ai.ca",
  "pharos-suite.ca",
  "www.pharos-suite.ca",
]);
const LOCAL_HOSTNAMES = new Set(["127.0.0.1", "localhost"]);
const PROTECTED_PATHS = new Set([
  "/normalized-results",
  "/normalized-results.html",
  "/tracker_dashboard.js",
]);
const BASIC_AUTH_REALM = "PHAROS normalized results";
const ALLOWED_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);
const SECURITY_HEADERS = {
  "Content-Security-Policy": "frame-ancestors 'none'; upgrade-insecure-requests",
  "Permissions-Policy": "camera=(), geolocation=(), microphone=(), payment=(), usb=()",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-Pharos-Surface": "pharos-pages",
};

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

function withSecurityHeaders(response) {
  for (const [header, value] of Object.entries(SECURITY_HEADERS)) {
    response.headers.set(header, value);
  }
  return response;
}

function redirectResponse(location) {
  return withSecurityHeaders(new Response(null, {
    status: 308,
    headers: { Location: location },
  }));
}

function isProtectedPath(pathname) {
  return PROTECTED_PATHS.has(pathname) || PROTECTED_PATHS.has(pathname.replace(/\/+$/, ""));
}

function unauthorizedResponse() {
  return withSecurityHeaders(new Response("Authentication required.", {
    status: 401,
    headers: {
      "WWW-Authenticate": `Basic realm="${BASIC_AUTH_REALM}", charset="UTF-8"`,
      "Cache-Control": "no-store",
      Pragma: "no-cache",
      Vary: "Authorization",
      "X-Robots-Tag": "noindex, nofollow",
    },
  }));
}

function protectedPathResponse(body, status) {
  return withSecurityHeaders(new Response(body, {
    status,
    headers: {
      "Cache-Control": "no-store",
      Pragma: "no-cache",
      Vary: "Authorization",
      "X-Robots-Tag": "noindex, nofollow",
    },
  }));
}

function methodNotAllowedResponse() {
  return withSecurityHeaders(new Response("Method not allowed.", {
    status: 405,
    headers: {
      Allow: "GET, HEAD, OPTIONS",
      "Cache-Control": "no-store",
    },
  }));
}

function optionsResponse() {
  return withSecurityHeaders(new Response(null, {
    status: 204,
    headers: {
      Allow: "GET, HEAD, OPTIONS",
      "Cache-Control": "no-store",
    },
  }));
}

export async function onRequest(context) {
  const url = new URL(context.request.url);

  if (url.protocol !== "https:" && !LOCAL_HOSTNAMES.has(url.hostname)) {
    url.protocol = "https:";
    return redirectResponse(url.toString());
  }

  if (REDIRECT_HOSTNAMES.has(url.hostname)) {
    url.protocol = "https:";
    url.hostname = CANONICAL_HOSTNAME;
    return redirectResponse(url.toString());
  }

  if (context.request.method === "OPTIONS") {
    return optionsResponse();
  }

  if (!ALLOWED_METHODS.has(context.request.method)) {
    return methodNotAllowedResponse();
  }

  if (isProtectedPath(url.pathname)) {
    const requiredUsername = context.env.NORMALIZED_RESULTS_LOGIN;
    const requiredPassword = context.env.NORMALIZED_RESULTS_PASSWORD;

    if (!requiredUsername || !requiredPassword) {
      return protectedPathResponse("Protected route is not configured.", 503);
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

  const response = await context.next();
  withSecurityHeaders(response);

  if (isProtectedPath(url.pathname)) {
    response.headers.set("Cache-Control", "no-store");
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Vary", "Authorization");
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
  }

  return response;
}
