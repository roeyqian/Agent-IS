const JSON_HEADERS = {
  "content-type": "application/json; charset=utf-8",
  "cache-control": "no-store",
};

const CORS_HEADERS = {
  "access-control-allow-origin": "*",
  "access-control-allow-headers": "authorization, content-type",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-max-age": "86400",
};

export function createRouter() {
  const routes = [];

  return {
    add(method, pattern, handler) {
      routes.push({ method: method.toUpperCase(), ...compilePattern(pattern), handler });
    },

    async handle(request, env, url) {
      const route = `${request.method.toUpperCase()} ${url.pathname}`;
      const matched = routes.find((candidate) => {
        if (candidate.method !== request.method.toUpperCase()) return false;
        return candidate.expression.test(url.pathname);
      });

      if (!matched) return json({ error: "API not found" }, 404);

      const match = url.pathname.match(matched.expression);
      const params = Object.fromEntries(
        matched.names.map((name, index) => [name, decodeURIComponent(match[index + 1])]),
      );
      return matched.handler({ request, env, url, params, route });
    },
  };
}

export async function handleApi(request, env, url, router) {
  if (request.method === "OPTIONS") return withCors(new Response(null, { status: 204 }));

  try {
    return withCors(await router.handle(request, env, url));
  } catch (error) {
    const status = Number(error?.status) || 500;
    if (status >= 500) console.error(error);
    return withCors(
      json(
        { error: status === 500 ? "Server processing failed" : String(error?.message || error) },
        status,
      ),
    );
  }
}

function compilePattern(pattern) {
  const names = [];
  const source = pattern
    .split("/")
    .map((segment) => {
      if (segment.startsWith(":")) {
        names.push(segment.slice(1));
        return "([^/]+)";
      }
      return escapeRegExp(segment);
    })
    .join("/");

  return { expression: new RegExp(`^${source}/?$`), names };
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function withCors(response) {
  const headers = new Headers(response.headers);
  for (const [key, value] of Object.entries(CORS_HEADERS)) headers.set(key, value);
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: JSON_HEADERS,
  });
}
