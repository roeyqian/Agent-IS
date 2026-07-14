import * as service from "./service.js";

export default function registerAdminRoutes(router) {
  router.add("GET", "/api/admin/users", ({ request, env, url }) => service.adminUsers(request, env, url));
  router.add("POST", "/api/admin/users", ({ request, env }) => service.createAdminUser(request, env));
  router.add("DELETE", "/api/admin/users/:userId", ({ request, env, params }) => service.deleteAdminUser(request, env, params.userId));
}
