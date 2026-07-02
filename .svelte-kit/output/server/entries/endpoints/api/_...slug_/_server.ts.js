const handler = ({ request, locals, getClientAddress }) => {
  const apiApp = locals.aphexCMS?.apiApp;
  if (!apiApp) {
    return new Response("CMS not initialized", { status: 503 });
  }
  try {
    request.headers.set("x-forwarded-for", getClientAddress());
  } catch {
  }
  return apiApp.fetch(request, {
    aphexCMS: locals.aphexCMS,
    auth: locals.auth ?? null
  });
};
const GET = handler;
const POST = handler;
const PUT = handler;
const DELETE = handler;
const PATCH = handler;
const OPTIONS = handler;
const HEAD = handler;
export {
  DELETE,
  GET,
  HEAD,
  OPTIONS,
  PATCH,
  POST,
  PUT
};
