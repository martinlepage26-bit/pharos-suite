const TARGET_HOSTNAME = "govern-ai.pages.dev";

function buildTargetUrl(requestUrl) {
  const targetUrl = new URL(requestUrl);
  targetUrl.protocol = "https:";
  targetUrl.hostname = TARGET_HOSTNAME;
  return targetUrl;
}

export default {
  async fetch(request) {
    const targetUrl = buildTargetUrl(request.url);
    const proxiedRequest = new Request(targetUrl.toString(), request);
    const upstreamResponse = await fetch(proxiedRequest);
    const response = new Response(upstreamResponse.body, upstreamResponse);

    response.headers.set("x-pharos-ai-proxy", "cloudflare-worker");
    return response;
  },
};
