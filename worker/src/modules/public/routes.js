import * as service from "./service.js";

export default function registerPublicRoutes(router) {
  router.add("GET", "/api/stimuli/:imageId", ({ env, params }) => {
    if (!/^[0-9a-f-]{36}$/i.test(params.imageId)) return new Response("Not found", { status: 404 });
    return service.serveStimulusImage(env, params.imageId.toLowerCase());
  });
}
