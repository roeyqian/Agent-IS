import * as service from "./service.js";

export default function registerAuthRoutes(router) {
  router.add("POST", "/api/register", ({ request, env }) => service.register(request, env));
  router.add("POST", "/api/login", ({ request, env }) => service.login(request, env));
  router.add("POST", "/api/logout", ({ request, env }) => service.logout(request, env));
  router.add("POST", "/api/change-password", ({ request, env }) => service.changePassword(request, env));
  router.add("GET", "/api/me", ({ request, env }) => service.me(request, env));
}
