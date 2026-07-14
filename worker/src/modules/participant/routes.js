import * as service from "./service.js";

export default function registerParticipantRoutes(router) {
  router.add("GET", "/api/history", ({ request, env }) => service.history(request, env));
  router.add("POST", "/api/chat", ({ request, env }) => service.chat(request, env));
  router.add("GET", "/api/tasks", ({ request, env, url }) => service.tasks(request, env, url));
  router.add("POST", "/api/tasks/:taskKey", ({ request, env, params }) => service.submitTask(request, env, params.taskKey));
  router.add("POST", "/api/help", ({ request, env }) => service.askCounselorHelp(request, env));
  router.add("GET", "/api/insights", ({ request, env, url }) => service.insights(request, env, url));
  router.add("GET", "/api/research-export", ({ request, env, url }) => service.researchExport(request, env, url));
  router.add("GET", "/api/ai-settings", ({ request, env }) => service.getAiSettings(request, env));
  router.add("PUT", "/api/ai-settings", ({ request, env }) => service.saveAiSettings(request, env));
}
