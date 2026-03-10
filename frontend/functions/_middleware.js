export async function onRequest(context) {
  const url = new URL(context.request.url);

  if (url.hostname === "www.govern-ai.ca") {
    url.hostname = "govern-ai.ca";
    return Response.redirect(url.toString(), 308);
  }

  return context.next();
}
