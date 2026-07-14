/// <reference path="../../worker-configuration.d.ts" />
// @ts-nocheck

import router from "./routes.js";
import { handleApi } from "./http.js";
import { processGeneratedTaskJob } from "../modules/api/service.js";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname.startsWith("/api/")) {
      return handleApi(request, env, url, router);
    }

    try {
      const assetResponse = await env.assets.fetch(request);
      if (url.pathname === "/" || url.pathname.endsWith(".html")) {
        const headers = new Headers(assetResponse.headers);
        headers.set("cache-control", "no-cache");
        return new Response(assetResponse.body, {
          status: assetResponse.status,
          statusText: assetResponse.statusText,
          headers,
        });
      }
      return assetResponse;
    } catch (error) {
      console.error(error);
      return new Response("Asset request failed", { status: 500 });
    }
  },

  async queue(batch, env) {
    for (const message of batch.messages) {
      await processGeneratedTaskJob(env, message);
    }
  },
};
