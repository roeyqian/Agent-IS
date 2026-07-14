import * as service from "./service.js";

export default function registerCounselorRoutes(router) {
  router.add("GET", "/api/counselor/cases", ({ request, env, url }) => service.counselorCases(request, env, url));
  router.add("GET", "/api/counselor/users/:userId", ({ request, env, url, params }) => service.counselorUserCase(request, env, params.userId, url));
  router.add("POST", "/api/counselor/users/:userId/message", ({ request, env, params }) => service.counselorMessage(request, env, params.userId));
  router.add("PUT", "/api/counselor/users/:userId/strategy", ({ request, env, params }) => service.counselorStrategy(request, env, params.userId));
}
