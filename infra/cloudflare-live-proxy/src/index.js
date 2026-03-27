const TARGET_HOSTNAME = "pharos-suite.pages.dev";
const REMOVED_ASSET_PATH = "/images/pharos-main-logo-quantum-lighthouse.png";

function buildTargetUrl(requestUrl) {
  const targetUrl = new URL(requestUrl);
  targetUrl.protocol = "https:";
  targetUrl.hostname = TARGET_HOSTNAME;
  return targetUrl;
}

export default {
  async fetch(request) {
    const requestUrl = new URL(request.url);

    if (requestUrl.pathname === REMOVED_ASSET_PATH) {
      return new Response("Gone", {
        status: 410,
        headers: {
          "cache-control": "no-store, no-cache, must-revalidate",
          "content-type": "text/plain; charset=utf-8",
          "x-pharos-proxy": "cloudflare-worker",
        },
      });
    }

    const targetUrl = buildTargetUrl(request.url);
    const proxiedRequest = new Request(targetUrl.toString(), request);
    const upstreamResponse = await fetch(proxiedRequest);
    const response = new Response(upstreamResponse.body, upstreamResponse);

    response.headers.set("x-pharos-proxy", "cloudflare-worker");
    return response;
  },
};
