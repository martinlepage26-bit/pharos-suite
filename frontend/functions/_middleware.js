export async function onRequest(context) {
  const url = new URL(context.request.url);
  const redirectHosts = new Set([
    "govern-ai.ca",
    "www.govern-ai.ca",
    "www.pharos-ai.ca",
  ]);

  if (redirectHosts.has(url.hostname)) {
    url.hostname = "pharos-ai.ca";
    return Response.redirect(url.toString(), 308);
  }

  return context.next();
}
