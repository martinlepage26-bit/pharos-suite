const CANONICAL_HOSTNAME = "pharos-ai.ca";
const REDIRECT_HOSTNAMES = new Set([
  "www.pharos-ai.ca",
  "govern-ai.ca",
  "www.govern-ai.ca",
]);

export async function onRequest(context) {
  const url = new URL(context.request.url);

  if (REDIRECT_HOSTNAMES.has(url.hostname)) {
    url.protocol = "https:";
    url.hostname = CANONICAL_HOSTNAME;
    return Response.redirect(url.toString(), 308);
  }

  return context.next();
}
