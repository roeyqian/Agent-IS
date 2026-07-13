/// <reference path="../worker-configuration.d.ts" />
// @ts-nocheck

import {
  buildProfile,
  buildSystemPrompt,
  buildTaskProgress,
  buildTaskProgressForCatalog,
  buildVisualizationBundle,
  deriveCareCase,
  generateFallbackReply,
  getResearchCopy,
  getTaskCatalog,
  METRIC_KEYS,
  normalizeLanguage,
  scoreGeneratedMicroTask,
  scoreTaskSubmission,
  summarizeTaskEvent,
} from "./research.js";

const JSON_HEADERS = {
  "content-type": "application/json; charset=utf-8",
  "cache-control": "no-store",
};

const MAX_MESSAGE_LENGTH = 3000;
const MAX_SETTINGS_URL_LENGTH = 300;
const DEFAULT_SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;
const SUPERADMIN_ID = "root";
const AI_DYNAMIC_TASK_LIMIT = 5;
const AI_DYNAMIC_TASK_PREFIX = "ai_dynamic:";
const STIMULUS_IMAGE_PREFIX = "stimuli/free-association/";
const ADAPTIVE_SOURCE_CATALOG = [
  {
    id: "consumer_impulse",
    citation: "Rook (1987), The Buying Impulse, Journal of Consumer Research.",
    scope: "unplanned purchase urges and cue-triggered approach",
  },
  {
    id: "impulse_buying_tendency",
    citation: "Verplanken & Herabadi (2001), Individual Differences in Impulse Buying Tendency, Journal of Economic Psychology.",
    scope: "affective and cognitive facets of impulse buying",
  },
  {
    id: "delay_discounting",
    citation: "Kable & Glimcher (2007), The Neural Correlates of Subjective Value During Intertemporal Choice, Nature Neuroscience.",
    scope: "immediate versus delayed reward trade-offs",
  },
  {
    id: "ambiguous_stimulus",
    citation: "McClelland, Koestner, & Weinberger (1989), How Do Self-Attributed and Implicit Motives Differ?, Psychological Review.",
    scope: "ambiguous-cue responses as exploratory, non-diagnostic evidence",
  },
];
const ADAPTIVE_SOURCE_IDS = new Set(ADAPTIVE_SOURCE_CATALOG.map((source) => source.id));

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    try {
      if (url.pathname.startsWith("/api/")) {
        return await handleApi(request, env, url);
      }
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
      const status =
        typeof error === "object" && error && "status" in error
          ? Number(error.status) || 500
          : 500;
      return json(
        {
          error: status === 500 ? "Server processing failed" : String(error.message || error),
        },
        status,
      );
    }
  },
};

async function handleApi(request, env, url) {
  if (request.method === "OPTIONS") return new Response(null, { status: 204 });

  const route = `${request.method} ${url.pathname}`;
  const taskMatch = url.pathname.match(/^\/api\/tasks\/([^/]+)$/);
  const stimulusImageMatch = url.pathname.match(/^\/api\/stimuli\/([0-9a-f-]{36})$/i);
  const counselorCaseMatch = url.pathname.match(/^\/api\/counselor\/users\/([^/]+)$/);
  const counselorMessageMatch = url.pathname.match(/^\/api\/counselor\/users\/([^/]+)\/message$/);
  const counselorStrategyMatch = url.pathname.match(/^\/api\/counselor\/users\/([^/]+)\/strategy$/);
  const adminUserMatch = url.pathname.match(/^\/api\/admin\/users\/([^/]+)$/);

  if (route === "POST /api/register") return register(request, env);
  if (route === "POST /api/login") return login(request, env);
  if (route === "POST /api/logout") return logout(request, env);
  if (route === "POST /api/change-password") return changePassword(request, env);
  if (route === "GET /api/me") return me(request, env);
  if (route === "GET /api/history") return history(request, env);
  if (route === "POST /api/chat") return chat(request, env);
  if (route === "GET /api/tasks") return tasks(request, env, url);
  if (request.method === "GET" && stimulusImageMatch) {
    return serveStimulusImage(env, stimulusImageMatch[1].toLowerCase());
  }
  if (request.method === "POST" && taskMatch) {
    return submitTask(request, env, decodeURIComponent(taskMatch[1]));
  }
  if (route === "POST /api/help") return askCounselorHelp(request, env);
  if (route === "GET /api/insights") return insights(request, env, url);
  if (route === "GET /api/research-export") return researchExport(request, env, url);
  if (route === "GET /api/ai-settings") return getAiSettings(request, env);
  if (route === "PUT /api/ai-settings") return saveAiSettings(request, env);

  if (route === "GET /api/counselor/cases") return counselorCases(request, env, url);
  if (request.method === "GET" && counselorCaseMatch) {
    return counselorUserCase(request, env, decodeURIComponent(counselorCaseMatch[1]), url);
  }
  if (request.method === "POST" && counselorMessageMatch) {
    return counselorMessage(request, env, decodeURIComponent(counselorMessageMatch[1]));
  }
  if (request.method === "PUT" && counselorStrategyMatch) {
    return counselorStrategy(request, env, decodeURIComponent(counselorStrategyMatch[1]));
  }
  if (route === "GET /api/admin/users") return adminUsers(request, env, url);
  if (route === "POST /api/admin/users") return createAdminUser(request, env);
  if (request.method === "DELETE" && adminUserMatch) {
    return deleteAdminUser(request, env, decodeURIComponent(adminUserMatch[1]));
  }

  return json({ error: "API not found" }, 404);
}

async function register(request, env) {
  const body = await readJson(request);
  const userId = normalizeUserId(body.userId);
  const password = String(body.password || "");

  if (!userId || password.length < 4) {
    return json({ error: "Please provide a valid user ID and a password with 4+ characters." }, 400);
  }

  const existing = await env.d1.prepare("SELECT id FROM users WHERE id = ?").bind(userId).first();
  if (existing) return json({ error: "User ID already exists." }, 409);

  const salt = randomHex(16);
  const passwordHash = await hashPassword(password, salt);
  const now = new Date().toISOString();
  const role = roleForRegisteredUser(userId);

  await env.d1.prepare(
    "INSERT INTO users (id, role, password_hash, salt, created_at, last_login_at) VALUES (?, ?, ?, ?, ?, ?)",
  )
    .bind(userId, role, passwordHash, salt, now, now)
    .run();

  const session = await createSession(env, userId);
  return json({ user: publicUser({ id: userId, role }, env), token: session.token, expiresAt: session.expiresAt }, 201);
}

async function login(request, env) {
  const body = await readJson(request);
  const userId = normalizeUserId(body.userId);
  const password = String(body.password || "");
  if (!userId || !password) return json({ error: "Missing credentials." }, 400);

  const user = await env.d1.prepare(
    "SELECT id, role, password_hash, salt, created_at, last_login_at FROM users WHERE id = ?",
  )
    .bind(userId)
    .first();
  if (!user) return json({ error: "User not found or password incorrect." }, 401);

  const passwordHash = await hashPassword(password, user.salt);
  if (!timingSafeEqual(passwordHash, user.password_hash)) {
    return json({ error: "User not found or password incorrect." }, 401);
  }

  await env.d1.prepare("UPDATE users SET last_login_at = ? WHERE id = ?")
    .bind(new Date().toISOString(), userId)
    .run();

  const session = await createSession(env, userId);
  return json({ user: publicUser(user, env), token: session.token, expiresAt: session.expiresAt });
}

async function logout(request, env) {
  const token = readBearerToken(request);
  if (token) await env.kv.delete(sessionKey(token));
  return json({ ok: true });
}

async function changePassword(request, env) {
  const user = await requireUser(request, env);
  const body = await readJson(request);
  const currentPassword = String(body.currentPassword || "");
  const newPassword = String(body.newPassword || "");
  const confirmPassword = String(body.confirmPassword || "");

  if (!currentPassword) return json({ error: "Current password is required." }, 400);
  if (newPassword.length < 4) return json({ error: "New password must have at least 4 characters." }, 400);
  if (newPassword !== confirmPassword) return json({ error: "Password confirmation does not match." }, 400);
  if (newPassword === currentPassword) return json({ error: "Choose a different password." }, 400);

  const credential = await env.d1.prepare("SELECT password_hash, salt FROM users WHERE id = ?")
    .bind(user.id)
    .first();
  if (!credential) throw httpError("User not found.", 404);

  const currentHash = await hashPassword(currentPassword, credential.salt);
  if (!timingSafeEqual(currentHash, credential.password_hash)) {
    return json({ error: "Current password is incorrect." }, 401);
  }

  const salt = randomHex(16);
  const passwordHash = await hashPassword(newPassword, salt);
  await env.d1.prepare("UPDATE users SET password_hash = ?, salt = ? WHERE id = ?")
    .bind(passwordHash, salt, user.id)
    .run();

  return json({ ok: true });
}

async function me(request, env) {
  const user = await requireUser(request, env);
  return json({ user: publicUser(user, env) });
}

async function history(request, env) {
  const user = await requireParticipant(request, env);
  const messages = await loadMessages(env, user.id, 120);
  return json({ messages });
}

async function tasks(request, env, url) {
  const user = await requireParticipant(request, env);
  const language = normalizeLanguage(url.searchParams.get("language"));
  const context = await loadParticipantContext(env, user.id);
  const profile = buildProfile({
    events: context.events,
    messages: context.messages.filter((item) => item.role === "user"),
    careCase: context.careCase,
    snapshots: context.snapshots,
    language,
  });
  const aiSettings = await getUserAiSettings(env, user.id, true);
  const taskCatalog = await buildParticipantTaskCatalog({
    env,
    userId: user.id,
    language,
    context,
    profile,
    aiSettings,
  });
  return json({
    tasks: taskCatalog,
    progress: buildTaskProgressForCatalog(taskCatalog, context.events, language),
    dynamicAiConfigured: Boolean(aiSettings.requestUrl && aiSettings.model && aiSettings.apiKey),
  });
}

async function submitTask(request, env, taskKey) {
  const user = await requireParticipant(request, env);
  const body = await readJson(request);
  const language = normalizeLanguage(body.language);
  const generatedTask = await getGeneratedTask(env, user.id, taskKey);
  if (generatedTask?.status === "completed") {
    return json({ error: language === "zh" ? "这道动态题已经提交过。" : "This generated task was already submitted." }, 409);
  }
  const result = generatedTask
    ? scoreGeneratedMicroTask(generatedTask.task, body, language)
    : scoreTaskSubmission(taskKey, body, language);
  const now = new Date().toISOString();

  await env.d1.prepare(
    "INSERT INTO task_events (id, user_id, task_key, payload_json, score_json, created_at) VALUES (?, ?, ?, ?, ?, ?)",
  )
    .bind(
      crypto.randomUUID(),
      user.id,
      taskKey,
      JSON.stringify(result.payload),
      JSON.stringify(result),
      now,
    )
    .run();

  if (generatedTask) {
    await markGeneratedTaskCompleted(env, user.id, taskKey, now);
  }

  await insertMessage(env, user.id, "system", result.headline, now, { taskKey });
  const derived = await refreshDerivedState(env, user.id, language);

  return json({
    event: {
      key: taskKey,
      summary: result.summary,
      metrics: result.metrics,
      tags: result.tags,
      createdAt: now,
    },
    profile: derived.profile,
    careCase: derived.careCase,
    tasks: buildTaskProgress(derived.events, language),
    visualization: buildVisualizationBundle({
      profile: derived.profile,
      snapshots: derived.snapshots,
      careCase: derived.careCase,
      language,
    }),
  });
}

async function buildParticipantTaskCatalog({ env, userId, language, context, profile, aiSettings }) {
  const baseTasks = getTaskCatalog(language, { events: context.events });
  const hasBaseline = context.events.some((event) => event.task_key === "cue_triage");
  if (!hasBaseline) return baseTasks;

  const generatedTasks = await ensureGeneratedTaskStimuli(env, userId, await loadGeneratedTasks(env, userId));
  const generatedCatalogTasks = generatedTasks.map((item) => publicGeneratedTask(item.task, language));
  const pending = generatedTasks.find((item) => item.status === "pending");
  if (pending?.task) return [...baseTasks, ...generatedCatalogTasks];

  const completedDynamicCount = new Set(
    context.events
      .filter((event) => isAiDynamicTaskKey(event.task_key))
      .map((event) => event.task_key),
  ).size;
  if (completedDynamicCount >= AI_DYNAMIC_TASK_LIMIT) return [...baseTasks, ...generatedCatalogTasks];
  if (!aiSettings.requestUrl || !aiSettings.model || !aiSettings.apiKey) return [...baseTasks, ...generatedCatalogTasks];

  try {
    const task = await createAiDynamicTask({
      env,
      userId,
      language,
      context,
      profile,
      aiSettings,
      questionIndex: completedDynamicCount + 1,
      priorGeneratedTasks: generatedTasks,
    });
    return [...baseTasks, ...generatedCatalogTasks, publicGeneratedTask(task, language)];
  } catch (error) {
    console.warn("AI dynamic task generation failed.", error);
    return [...baseTasks, ...generatedCatalogTasks];
  }
}

async function createAiDynamicTask({ env, userId, language, context, profile, aiSettings, questionIndex, priorGeneratedTasks }) {
  const taskKey = `${AI_DYNAMIC_TASK_PREFIX}${questionIndex}:${crypto.randomUUID()}`;
  const focusMetrics = selectAdaptiveFocusMetrics(profile, priorGeneratedTasks);
  const task = await generateAiDynamicTask({
    taskKey,
    language,
    profile,
    events: context.events,
    aiSettings,
    questionIndex,
    focusMetrics,
  });
  await attachProjectiveStimulusImage(env, task);
  const now = new Date().toISOString();
  await env.d1.prepare(
    `INSERT INTO generated_tasks (task_key, user_id, status, task_json, source_json, created_at, completed_at)
     VALUES (?, ?, 'pending', ?, ?, ?, NULL)`,
  )
    .bind(
      taskKey,
      userId,
      JSON.stringify(task),
      JSON.stringify({
        questionIndex,
        profileStage: profile.stage,
        riskScore: profile.risk_score,
        eventCount: context.events.length,
        focusMetrics,
        generationVersion: task.research?.generationVersion || "bilingual-adaptive-v3",
        model: aiSettings.model,
        stimulusImageIds: task.items
          .filter((item) => item.type === "projective_slider")
          .map((item) => item.stimulus_image_id),
      }),
      now,
    )
    .run();
  return task;
}

async function generateAiDynamicTask({ taskKey, language, profile, events, aiSettings, questionIndex, focusMetrics }) {
  const recentEvents = [...(events || [])]
    .slice(-6)
    .map((event) => {
      const score = parseJson(event.score_json || "{}", {});
      return {
        key: event.task_key,
        summary: score.summary || "",
        metrics: score.metrics || {},
        tags: score.tags || [],
      };
    });
  const systemPrompt = [
    "You generate one indirect three-question adaptive task for AgentIS.",
    "Each question must be newly written for this participant from the supplied profile and recent answers.",
    "Do not use fixed named tests, preset batteries, or section labels such as Symbol Drift or Route Sampler.",
    "Do not ask direct shopping, spending, impulsivity, addiction, diagnosis, or self-label questions.",
    "Return only valid JSON. No markdown.",
    "Every participant-facing text field must include semantically equivalent English and Simplified Chinese text.",
    "The English and Chinese versions must describe the same situation, choice meaning, and response scope.",
    "Do not translate or alter option keys, tags, metrics, or their ordering between languages.",
    "The task must be research-oriented but is not a diagnosis or a standardized clinical test.",
    "The projective_slider is an original free-association response to an ambiguous, symmetric form. It must first invite a brief open-ended description of what the participant sees or feels, then ask for an approach-versus-pause position in a relevant unexpected-offer moment. It is not a Rorschach test: do not use Rorschach images, norms, terminology, or clinical claims.",
    "Schema:",
    JSON.stringify({
      title_en: "short English task title",
      title_zh: "对应的简体中文任务标题",
      description_en: "one English sentence explaining that this is generated from the latest profile",
      description_zh: "对应的简体中文说明",
      theory_en: "one English sentence naming the behavioral construct indirectly probed",
      theory_zh: "对应的简体中文理论说明",
      source_ids: ["consumer_impulse", "ambiguous_stimulus"],
      items: [
        {
          type: "choice",
          prompt_en: "one indirect English situation or metaphor prompt",
          prompt_zh: "对应的简体中文情境或隐喻题干",
          options: [
            {
              key: "A",
              label_en: "English option text",
              label_zh: "对应的简体中文选项文本",
              tag: "short_tag",
              metrics: {
                cue_drive: 50,
                emotion_relief: 50,
                social_pull: 50,
                present_bias: 50,
                planning_strength: 50,
                help_readiness: 50,
              },
            },
          ],
        },
        {
          type: "fill_blank",
          prompt_en: "one indirect English completion prompt",
          prompt_zh: "对应的简体中文补全题干",
          placeholder_en: "short English answer placeholder",
          placeholder_zh: "对应的简体中文作答提示",
          tag: "short_tag",
          metrics: {
            cue_drive: 50,
            emotion_relief: 50,
            social_pull: 50,
            present_bias: 50,
            planning_strength: 50,
            help_readiness: 50,
          },
        },
        {
          type: "projective_slider",
          prompt_en: "an English prompt asking for a first free association from the pictured ambiguous form, then a response to an unexpected offer",
          prompt_zh: "对应的简体中文题干",
          stimulus_en: "a short, neutral English label for a free-association shape",
          stimulus_zh: "对应的简体中文中性图形联想标签",
          association_prompt_en: "short English instruction asking what the form first resembles or brings to mind",
          association_prompt_zh: "对应的简体中文联想作答提示",
          association_placeholder_en: "short English free-association answer placeholder",
          association_placeholder_zh: "对应的简体中文联想作答占位提示",
          left_anchor_en: "a reflective, delay-oriented endpoint",
          left_anchor_zh: "对应的反思/延迟端点",
          right_anchor_en: "an immediate, approach-oriented endpoint",
          right_anchor_zh: "对应的即时接近端点",
          low_tag: "reflective_pause",
          high_tag: "immediate_approach",
          metrics_low: {
            cue_drive: 25,
            emotion_relief: 30,
            social_pull: 35,
            present_bias: 20,
            planning_strength: 80,
            help_readiness: 55,
          },
          metrics_high: {
            cue_drive: 80,
            emotion_relief: 70,
            social_pull: 60,
            present_bias: 82,
            planning_strength: 25,
            help_readiness: 30,
          },
        },
      ],
    }),
    "Produce exactly 3 items.",
    "Produce exactly one choice, one fill_blank, and one projective_slider item.",
    "Choice items must have exactly 4 options with keys A, B, C, D.",
    "Fill_blank items must include both language placeholders, tag, and metrics. They must be answerable in one short sentence.",
    "Projective_slider items must include the bilingual free-association shape label, association prompt and placeholder, anchors, low_tag, high_tag, metrics_low, and metrics_high. The free association is qualitative evidence; the 0-to-100 slider records an immediate approach-versus-pause position. It must not make personality or clinical claims.",
    `source_ids must contain one or two IDs from this catalog only: ${JSON.stringify(ADAPTIVE_SOURCE_CATALOG)}.`,
    "Reject the task yourself if any required English or Simplified Chinese text is missing.",
    "Each metrics value must be an integer from 0 to 100.",
  ].join("\n");
  const userMessage = JSON.stringify({
    participantInterfaceLanguage: language === "zh" ? "Simplified Chinese" : "English",
    requiredOutputLanguages: ["English", "Simplified Chinese"],
    questionIndex,
    totalDynamicQuestions: AI_DYNAMIC_TASK_LIMIT,
    adaptiveFocusMetrics: focusMetrics,
    profile: {
      stage: profile.stage,
      risk_score: profile.risk_score,
      risk_band: profile.risk_band,
      metrics: profile.metrics,
      triggers: profile.triggers,
      protective_factors: profile.protective_factors,
      suggested_moves: profile.suggested_moves,
      summary: profile.summary,
    },
    recentEvents,
  });
  const text = await callChatCompletion({
    requestUrl: aiSettings.requestUrl,
    model: aiSettings.model,
    apiKey: aiSettings.apiKey,
    systemPrompt,
    messages: [],
    userMessage,
  });
  const data = parseJson(extractJsonObject(text), null);
  return normalizeGeneratedTaskData(data, taskKey, questionIndex, focusMetrics);
}

function normalizeGeneratedTaskData(data, taskKey, questionIndex, focusMetrics) {
  if (!data || typeof data !== "object") {
    throw new Error("AI dynamic task JSON was invalid.");
  }
  const rawItems = Array.isArray(data.items) && data.items.length
    ? data.items
    : [{ type: "choice", prompt_en: data.prompt_en, prompt_zh: data.prompt_zh, options: data.options }];
  let items = rawItems.slice(0, 3).map((item, index) => normalizeGeneratedItem(item, index));
  while (items.length < 3) {
    items.push(buildFallbackFillBlankItem(questionIndex, items.length));
  }
  items = ensureGeneratedItemTypes(items, questionIndex);

  const title = requireBilingualText(data, "title", "AI dynamic task title");
  const description = requireBilingualText(data, "description", "AI dynamic task description");
  const theory = requireBilingualText(data, "theory", "AI dynamic task theory");

  return {
    key: taskKey,
    kind: "micro_choices",
    estimatedMinutes: 4,
    title: title.en,
    title_zh: title.zh,
    description: description.en,
    description_zh: description.zh,
    theory: theory.en,
    theory_zh: theory.zh,
    aiGenerated: true,
    research: {
      generationVersion: "bilingual-adaptive-v4",
      focusMetrics: [...focusMetrics],
      questionIndex,
      sourceIds: normalizeSourceIds(data.source_ids),
    },
    items,
  };
}

function normalizeGeneratedItem(item, index) {
  const prompt = requireBilingualText(item, "prompt", "AI dynamic item prompt");
  const requestedType = String(item?.type || "").toLowerCase();
  const type = ["choice", "fill_blank", "projective_slider"].includes(requestedType) ? requestedType : "choice";
  const base = {
    key: `q${index + 1}`,
    index: index + 1,
    type,
    prompt: prompt.en,
    prompt_zh: prompt.zh,
  };
  if (type === "fill_blank") {
    const placeholder = requireBilingualText(item, "placeholder", "AI dynamic fill-in placeholder");
    return {
      ...base,
      placeholder: placeholder.en.slice(0, 120),
      placeholder_zh: placeholder.zh.slice(0, 120),
      tag: cleanTag(item?.tag || `fill_blank_${index + 1}`),
      metrics: normalizeMetricMap(item?.metrics),
    };
  }

  if (type === "projective_slider") {
    const stimulus = requireBilingualText(item, "stimulus", "AI dynamic free-association shape label");
    const associationPrompt = requireBilingualText(item, "association_prompt", "AI dynamic free-association prompt");
    const associationPlaceholder = requireBilingualText(item, "association_placeholder", "AI dynamic free-association placeholder");
    const leftAnchor = requireBilingualText(item, "left_anchor", "AI dynamic slider left anchor");
    const rightAnchor = requireBilingualText(item, "right_anchor", "AI dynamic slider right anchor");
    return {
      ...base,
      stimulus: stimulus.en.slice(0, 180),
      stimulus_zh: stimulus.zh.slice(0, 180),
      association_prompt: associationPrompt.en.slice(0, 180),
      association_prompt_zh: associationPrompt.zh.slice(0, 180),
      association_placeholder: associationPlaceholder.en.slice(0, 120),
      association_placeholder_zh: associationPlaceholder.zh.slice(0, 120),
      left_anchor: leftAnchor.en.slice(0, 120),
      left_anchor_zh: leftAnchor.zh.slice(0, 120),
      right_anchor: rightAnchor.en.slice(0, 120),
      right_anchor_zh: rightAnchor.zh.slice(0, 120),
      low_tag: cleanTag(item?.low_tag || `reflective_pause_${index + 1}`),
      high_tag: cleanTag(item?.high_tag || `immediate_approach_${index + 1}`),
      metrics_low: normalizeMetricMap(item?.metrics_low),
      metrics_high: normalizeMetricMap(item?.metrics_high),
    };
  }

  const options = Array.isArray(item?.options) ? item.options.slice(0, 4) : [];
  if (options.length !== 4) throw new Error("AI dynamic choice item must include four options.");
  return {
    ...base,
    options: options.map((option, optionIndex) => normalizeGeneratedOption(option, optionIndex)),
  };
}

function normalizeGeneratedOption(option, index) {
  const key = ["A", "B", "C", "D"][index];
  const label = requireBilingualText(option, "label", "AI dynamic option");
  return {
    key,
    label: label.en,
    label_zh: label.zh,
    tag: cleanTag(option?.tag || key),
    metrics: normalizeMetricMap(option?.metrics),
  };
}

function buildFallbackFillBlankItem(questionIndex, index) {
  return {
    key: `q${index + 1}`,
    index: index + 1,
    type: "fill_blank",
    prompt: "Complete this situation with one short cue you would say to yourself.",
    prompt_zh: "请为这个情境补上一句你会对自己说的短提示。",
    placeholder: "Write one short cue",
    placeholder_zh: "写一句短提示",
    tag: `fallback_reflection_${questionIndex}`,
    metrics: normalizeMetricMap({ planning_strength: 68, present_bias: 36, help_readiness: 56 }),
  };
}

function ensureGeneratedItemTypes(items, questionIndex) {
  const fallbackBuilders = {
    choice: buildFallbackChoiceItem,
    fill_blank: buildFallbackFillBlankItem,
    projective_slider: buildFallbackProjectiveSliderItem,
  };
  for (const type of Object.keys(fallbackBuilders)) {
    if (items.some((item) => item.type === type)) continue;
    const replacementIndex = items.findIndex(
      (candidate) => items.filter((item) => item.type === candidate.type).length > 1,
    );
    if (replacementIndex < 0) throw new Error(`AI dynamic task is missing required ${type} item.`);
    items[replacementIndex] = fallbackBuilders[type](questionIndex, replacementIndex);
  }
  return items.map((item, index) => ({ ...item, key: `q${index + 1}`, index: index + 1 }));
}

function buildFallbackChoiceItem(questionIndex, index) {
  return {
    key: `q${index + 1}`,
    index: index + 1,
    type: "choice",
    prompt: "An unexpected offer appears while you are doing something else. What would you notice first?",
    prompt_zh: "当一个意外优惠在你做其他事情时出现，你最先会注意什么？",
    options: [
      { key: "A", label: "How little time seems left", label_zh: "看起来还剩多少时间", tag: "countdown", metrics: normalizeMetricMap({ cue_drive: 76, present_bias: 76, planning_strength: 26 }) },
      { key: "B", label: "Whether it matches a plan I already made", label_zh: "它是否符合我已有的计划", tag: "planning", metrics: normalizeMetricMap({ cue_drive: 30, present_bias: 28, planning_strength: 82 }) },
      { key: "C", label: "Whether it would change my mood right away", label_zh: "它能否立刻改变我的心情", tag: "mood_relief", metrics: normalizeMetricMap({ cue_drive: 66, emotion_relief: 74, present_bias: 66, planning_strength: 34 }) },
      { key: "D", label: "Who else is talking about it", label_zh: "还有谁在谈论它", tag: "social_proof", metrics: normalizeMetricMap({ social_pull: 76, cue_drive: 52, planning_strength: 48 }) },
    ],
  };
}

function buildFallbackProjectiveSliderItem(questionIndex, index) {
  return {
    key: `q${index + 1}`,
    index: index + 1,
    type: "projective_slider",
    prompt: "Look at the form for a few seconds. Write the first thing, scene, or feeling it brings to mind. Then imagine an unexpected offer appears and place the marker where your first response would land.",
    prompt_zh: "先安静看图几秒。请写下它让你最先想到的人、物、场景或感受；然后想象一个计划外优惠突然出现，标出你此刻最初的反应会落在哪里。",
    stimulus: "Free-association shape",
    stimulus_zh: "开放式图形联想",
    association_prompt: "What does this form first resemble or bring to mind?",
    association_prompt_zh: "这幅图形第一眼像什么，或让你想到什么？",
    association_placeholder: "Write a short first impression",
    association_placeholder_zh: "写下你的第一联想",
    left_anchor: "I would pause and check what I need",
    left_anchor_zh: "我会先停一下，想想自己是否真的需要",
    right_anchor: "I would move toward it right away",
    right_anchor_zh: "我会立刻靠近它",
    low_tag: `reflective_pause_${questionIndex}`,
    high_tag: `immediate_approach_${questionIndex}`,
    metrics_low: normalizeMetricMap({ cue_drive: 24, emotion_relief: 30, social_pull: 36, present_bias: 20, planning_strength: 82, help_readiness: 56 }),
    metrics_high: normalizeMetricMap({ cue_drive: 80, emotion_relief: 70, social_pull: 60, present_bias: 82, planning_strength: 24, help_readiness: 30 }),
  };
}

function normalizeMetricMap(metrics) {
  return Object.fromEntries(
    METRIC_KEYS.map((key) => [key, clampMetric(metrics?.[key] ?? 50)]),
  );
}

function requireBilingualText(value, field, label) {
  const en = cleanText(value?.[`${field}_en`]);
  const zh = cleanText(value?.[`${field}_zh`]);
  if (!en || !zh) throw new Error(`${label} must include English and Simplified Chinese text.`);
  return { en, zh };
}

function publicGeneratedTask(task, language) {
  return {
    key: task.key,
    kind: task.kind,
    estimatedMinutes: task.estimatedMinutes,
    title: selectGeneratedText(task.title, task.title_zh, language),
    description: selectGeneratedText(task.description, task.description_zh, language),
    theory: selectGeneratedText(task.theory, task.theory_zh, language),
    aiGenerated: Boolean(task.aiGenerated),
    items: (task.items || []).map((item) => ({
      key: item.key,
      index: item.index,
      type: item.type || "choice",
      prompt: selectGeneratedText(item.prompt, item.prompt_zh, language),
      placeholder: selectGeneratedText(item.placeholder, item.placeholder_zh, language),
      stimulus: selectGeneratedText(item.stimulus, item.stimulus_zh, language),
      stimulusImageUrl: item.stimulus_image_id ? `/api/stimuli/${item.stimulus_image_id}` : "",
      associationPrompt: selectGeneratedText(item.association_prompt, item.association_prompt_zh, language),
      associationPlaceholder: selectGeneratedText(item.association_placeholder, item.association_placeholder_zh, language),
      leftAnchor: selectGeneratedText(item.left_anchor, item.left_anchor_zh, language),
      rightAnchor: selectGeneratedText(item.right_anchor, item.right_anchor_zh, language),
      options: (item.options || []).map((option) => ({
        key: option.key,
        label: selectGeneratedText(option.label, option.label_zh, language),
      })),
    })),
  };
}

async function ensureGeneratedTaskStimuli(env, userId, generatedTasks) {
  for (const generatedTask of generatedTasks) {
    if (!hasProjectiveItemWithoutStimulus(generatedTask.task)) continue;
    await attachProjectiveStimulusImage(env, generatedTask.task);
    await env.d1.prepare(
      "UPDATE generated_tasks SET task_json = ? WHERE user_id = ? AND task_key = ?",
    )
      .bind(JSON.stringify(generatedTask.task), userId, generatedTask.taskKey)
      .run();
  }
  return generatedTasks;
}

function hasProjectiveItemWithoutStimulus(task) {
  return (task?.items || []).some((item) => item.type === "projective_slider" && !item.stimulus_image_id);
}

async function attachProjectiveStimulusImage(env, task) {
  const projectiveItems = (task?.items || []).filter(
    (item) => item.type === "projective_slider" && !item.stimulus_image_id,
  );
  for (const item of projectiveItems) {
    const imageId = crypto.randomUUID();
    await env.r2.put(stimulusImageObjectKey(imageId), createProjectiveStimulusSvg(imageId), {
      httpMetadata: {
        contentType: "image/svg+xml; charset=utf-8",
        cacheControl: "public, max-age=31536000, immutable",
      },
    });
    item.stimulus_image_id = imageId;
  }
}

async function serveStimulusImage(env, imageId) {
  const image = await env.r2.get(stimulusImageObjectKey(imageId));
  if (!image) return new Response("Not found", { status: 404 });
  return new Response(image.body, {
    headers: {
      "cache-control": "public, max-age=31536000, immutable",
      "content-security-policy": "default-src 'none'; style-src 'unsafe-inline'",
      "content-type": "image/svg+xml; charset=utf-8",
      "x-content-type-options": "nosniff",
    },
  });
}

function stimulusImageObjectKey(imageId) {
  return `${STIMULUS_IMAGE_PREFIX}${imageId}.svg`;
}

function createProjectiveStimulusSvg(seed) {
  const random = seededRandom(seed);
  const hue = Math.round(205 + random() * 36);
  const accentHue = Math.round(188 + random() * 42);
  const centerX = 400;
  const leftShapes = Array.from({ length: 6 + Math.floor(random() * 4) }, () => {
    const x = Math.round(120 + random() * 230);
    const y = Math.round(62 + random() * 345);
    const width = Math.round(26 + random() * 86);
    const height = Math.round(22 + random() * 82);
    const curve = Math.round(0.28 * width + random() * 0.55 * width);
    const tilt = Math.round(-38 + random() * 76);
    return `<path d="M ${x} ${y} C ${x - curve} ${y + height * 0.16} ${x - width} ${y + height * 0.47} ${x - width * 0.54} ${y + height} C ${x - width * 0.08} ${y + height * 1.2} ${x + width * 0.25} ${y + height * 0.72} ${x + width * 0.08} ${y + height * 0.3} C ${x + width * 0.28} ${y + height * 0.02} ${x + curve} ${y - height * 0.2} ${x} ${y} Z" transform="rotate(${tilt} ${x} ${y})" />`;
  }).join("");
  const droplets = Array.from({ length: 3 + Math.floor(random() * 4) }, () => {
    const cx = Math.round(148 + random() * 180);
    const cy = Math.round(58 + random() * 362);
    const radius = Math.round(5 + random() * 18);
    return `<circle cx="${cx}" cy="${cy}" r="${radius}" />`;
  }).join("");
  const centerMarks = Array.from({ length: 2 + Math.floor(random() * 3) }, () => {
    const y = Math.round(90 + random() * 280);
    const rx = Math.round(8 + random() * 24);
    const ry = Math.round(12 + random() * 42);
    return `<ellipse cx="${centerX}" cy="${y}" rx="${rx}" ry="${ry}" />`;
  }).join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 480" role="img" aria-label="Original abstract free-association form"><defs><radialGradient id="glow" cx="50%" cy="46%" r="62%"><stop offset="0" stop-color="#${hslToHex(hue, 43, 20)}"/><stop offset="1" stop-color="#030507"/></radialGradient><linearGradient id="ink" x1="0" x2="1" y1="0" y2="1"><stop stop-color="#${hslToHex(hue, 58, 43)}"/><stop offset="1" stop-color="#${hslToHex(accentHue, 48, 26)}"/></linearGradient></defs><rect width="800" height="480" fill="url(#glow)"/><g fill="url(#ink)" fill-opacity=".78" stroke="#${hslToHex(hue, 24, 68)}" stroke-opacity=".62" stroke-width="2">${leftShapes}${droplets}<g transform="translate(800 0) scale(-1 1)">${leftShapes}${droplets}</g></g><g fill="#${hslToHex(accentHue, 39, 47)}" fill-opacity=".6" stroke="#${hslToHex(hue, 20, 72)}" stroke-opacity=".5" stroke-width="1.5">${centerMarks}</g><path d="M 400 60 C ${Math.round(386 + random() * 9)} 170 ${Math.round(414 - random() * 9)} 310 400 420" fill="none" stroke="#${hslToHex(hue, 22, 68)}" stroke-opacity=".58" stroke-width="2"/></svg>`;
}

function seededRandom(seed) {
  let state = 2166136261;
  for (const character of seed) {
    state ^= character.charCodeAt(0);
    state = Math.imul(state, 16777619);
  }
  return () => {
    state += 0x6d2b79f5;
    let value = Math.imul(state ^ (state >>> 15), 1 | state);
    value ^= value + Math.imul(value ^ (value >>> 7), 61 | value);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function hslToHex(hue, saturation, lightness) {
  const chroma = (1 - Math.abs(2 * (lightness / 100) - 1)) * (saturation / 100);
  const segment = hue / 60;
  const secondary = chroma * (1 - Math.abs((segment % 2) - 1));
  const [red, green, blue] = segment < 1 ? [chroma, secondary, 0]
    : segment < 2 ? [secondary, chroma, 0]
      : segment < 3 ? [0, chroma, secondary]
        : segment < 4 ? [0, secondary, chroma]
          : segment < 5 ? [secondary, 0, chroma]
            : [chroma, 0, secondary];
  const offset = lightness / 100 - chroma / 2;
  return [red, green, blue]
    .map((channel) => Math.round((channel + offset) * 255).toString(16).padStart(2, "0"))
    .join("");
}

function selectGeneratedText(english, chinese, language) {
  const isChinese = language === "zh";
  return cleanText(isChinese ? chinese || english : english || chinese);
}

async function loadGeneratedTasks(env, userId) {
  const rows = await env.d1.prepare(
    "SELECT task_key, status, task_json, source_json, created_at, completed_at FROM generated_tasks WHERE user_id = ? ORDER BY created_at ASC",
  )
    .bind(userId)
    .all();
  return (rows.results || [])
    .map((row) => ({
      taskKey: row.task_key,
      status: row.status,
      task: parseJson(row.task_json || "{}", null),
      source: parseJson(row.source_json || "{}", {}),
      createdAt: row.created_at,
      completedAt: row.completed_at || null,
    }))
    .filter((item) => item.task?.key);
}

async function getGeneratedTask(env, userId, taskKey) {
  if (!isAiDynamicTaskKey(taskKey)) return null;
  const row = await env.d1.prepare(
    "SELECT task_key, status, task_json, created_at, completed_at FROM generated_tasks WHERE user_id = ? AND task_key = ?",
  )
    .bind(userId, taskKey)
    .first();
  if (!row) return null;
  return {
    taskKey: row.task_key,
    status: row.status,
    task: parseJson(row.task_json || "{}", null),
    createdAt: row.created_at,
    completedAt: row.completed_at || null,
  };
}

async function markGeneratedTaskCompleted(env, userId, taskKey, completedAt) {
  await env.d1.prepare(
    "UPDATE generated_tasks SET status = 'completed', completed_at = ? WHERE user_id = ? AND task_key = ?",
  )
    .bind(completedAt, userId, taskKey)
    .run();
}

function isAiDynamicTaskKey(taskKey) {
  return String(taskKey || "").startsWith(AI_DYNAMIC_TASK_PREFIX);
}

function extractJsonObject(text) {
  const trimmed = String(text || "").trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "");
  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) return trimmed;
  return trimmed.slice(start, end + 1);
}

function cleanText(value) {
  return String(value || "").replace(/\s+/g, " ").trim().slice(0, 500);
}

function cleanTag(value) {
  return String(value || "").replace(/[^a-zA-Z0-9_\-\u4e00-\u9fff]/g, "_").slice(0, 40) || "ai_generated";
}

function normalizeSourceIds(sourceIds) {
  const normalized = Array.isArray(sourceIds)
    ? sourceIds.map((sourceId) => String(sourceId || "").trim()).filter((sourceId) => ADAPTIVE_SOURCE_IDS.has(sourceId))
    : [];
  const deduplicated = [...new Set(normalized)].slice(0, 2);
  return deduplicated.length ? deduplicated : ["consumer_impulse", "ambiguous_stimulus"];
}

function clampMetric(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return 50;
  return Math.max(0, Math.min(100, Math.round(number)));
}

function selectAdaptiveFocusMetrics(profile, priorGeneratedTasks) {
  const riskMetrics = new Set(["cue_drive", "emotion_relief", "social_pull", "present_bias"]);
  const previouslyFocused = new Set(
    (priorGeneratedTasks || []).flatMap((item) => item.source?.focusMetrics || item.task?.research?.focusMetrics || []),
  );
  const candidates = METRIC_KEYS.map((key, index) => {
    const value = clampMetric(profile.metrics?.[key]);
    return {
      key,
      index,
      priority: riskMetrics.has(key) ? value : 100 - value,
    };
  }).sort((left, right) => right.priority - left.priority || left.index - right.index);
  const unseen = candidates.filter((candidate) => !previouslyFocused.has(candidate.key));
  return (unseen.length >= 2 ? unseen : candidates).slice(0, 2).map((candidate) => candidate.key);
}

async function askCounselorHelp(request, env) {
  const user = await requireParticipant(request, env);
  const body = await readJson(request);
  const language = normalizeLanguage(body.language);
  const now = new Date().toISOString();
  const note = String(body.note || "").trim();

  await insertMessage(
    env,
    user.id,
    "system",
    language === "zh" ? "参与者主动请求顾问加入。" : "Participant requested counselor involvement.",
    now,
    { manualHelpRequested: true, note },
  );

  const derived = await refreshDerivedState(env, user.id, language, { manualHelpRequested: true });
  return json({ ok: true, profile: derived.profile, careCase: derived.careCase });
}

async function chat(request, env) {
  const user = await requireParticipant(request, env);
  const body = await readJson(request);
  const language = normalizeLanguage(body.language);
  const message = String(body.message || "").trim();
  if (!message) return json({ error: "Message cannot be empty." }, 400);
  if (message.length > MAX_MESSAGE_LENGTH) {
    return json({ error: `Message cannot exceed ${MAX_MESSAGE_LENGTH} characters.` }, 400);
  }

  const now = new Date().toISOString();
  const productSignals = await fetchSharedPageSignals(message);
  await insertMessage(env, user.id, "user", message, now, { productSignals });

  const context = await loadParticipantContext(env, user.id);
  const profile = buildProfile({
    events: context.events,
    messages: context.messages.filter((item) => item.role === "user"),
    careCase: context.careCase,
    snapshots: context.snapshots,
    language,
  });
  const careCase = deriveCareCase({
    profile,
    careCase: context.careCase,
    manualHelpRequested: false,
    snapshots: context.snapshots,
    language,
  });
  const aiSettings = await getUserAiSettings(env, user.id, true);
  const reply = await generateAssistantReply({
    env,
    aiSettings,
    language,
    message,
    profile,
    careCase,
    messages: context.messages,
    productSignals,
  });

  await insertMessage(env, user.id, "assistant", reply, new Date().toISOString(), { productSignals });
  const derived = await refreshDerivedState(env, user.id, language);

  return json({
    reply,
    profile: derived.profile,
    careCase: derived.careCase,
    aiConfigured: Boolean(aiSettings.requestUrl && aiSettings.model && aiSettings.apiKey),
    visualization: buildVisualizationBundle({
      profile: derived.profile,
      snapshots: derived.snapshots,
      careCase: derived.careCase,
      language,
    }),
  });
}

async function insights(request, env, url) {
  const user = await requireParticipant(request, env);
  const language = normalizeLanguage(url.searchParams.get("language"));
  const context = await loadParticipantContext(env, user.id);
  const profile = buildProfile({
    events: context.events,
    messages: context.messages.filter((item) => item.role === "user"),
    careCase: context.careCase,
    snapshots: context.snapshots,
    language,
  });
  const careCase = deriveCareCase({
    profile,
    careCase: context.careCase,
    manualHelpRequested: false,
    snapshots: context.snapshots,
    language,
  });
  const totals = await loadTotals(env);
  const commonFeatures = await loadCommonFeatures(env);
  const aiSettings = await getUserAiSettings(env, user.id, true);

  return json({
    profile,
    careCase,
    tasks: buildTaskProgress(context.events, language),
    visualization: buildVisualizationBundle({
      profile,
      snapshots: context.snapshots,
      careCase,
      language,
    }),
    commonFeatures,
    totals,
    aiConfigured: Boolean(aiSettings.requestUrl && aiSettings.model && aiSettings.apiKey),
  });
}

async function researchExport(request, env, url) {
  const user = await requireParticipant(request, env);
  const language = normalizeLanguage(url.searchParams.get("language"));
  const detail = await buildParticipantCase(env, user.id, language);
  const generatedTasks = await loadGeneratedTasks(env, user.id);

  return json({
    filename: `agentis-${user.id}-${Date.now()}.json`,
    generatedAt: new Date().toISOString(),
    protocolId: detail.profile.protocolId,
    user: publicUser(user, env),
    generatedTasks,
    ...detail,
  });
}

async function getAiSettings(request, env) {
  const user = await requireParticipant(request, env);
  const settings = await getUserAiSettings(env, user.id, true);
  return json({ settings });
}

async function saveAiSettings(request, env) {
  const user = await requireParticipant(request, env);
  const body = await readJson(request);
  const existing = await getUserAiSettings(env, user.id, true);
  const requestUrl = normalizeRequestUrl(body.requestUrl ?? existing.requestUrl);
  const model = String(body.model ?? existing.model ?? "").trim();
  const rawApiKey = typeof body.apiKey === "string" ? body.apiKey.trim() : "";
  const apiKey = body.clearApiKey ? "" : rawApiKey || existing.apiKey || "";

  if (!requestUrl) return json({ error: "Please provide a valid AI base URL." }, 400);
  if (!model) return json({ error: "Please provide a model name." }, 400);
  if (!apiKey) return json({ error: "Please provide an API key." }, 400);

  const now = new Date().toISOString();
  await env.d1.prepare(
    `INSERT INTO user_ai_settings (user_id, request_url, model, api_key, updated_at)
     VALUES (?, ?, ?, ?, ?)
     ON CONFLICT(user_id) DO UPDATE SET
       request_url = excluded.request_url,
       model = excluded.model,
       api_key = excluded.api_key,
       updated_at = excluded.updated_at`,
  )
    .bind(user.id, requestUrl, model, apiKey, now)
    .run();

  return json({ settings: sanitizeAiSettings({ requestUrl, model, apiKey, updatedAt: now }, true) });
}

async function counselorCases(request, env, url) {
  await requireCounselor(request, env);
  const language = normalizeLanguage(url.searchParams.get("language"));
  const rows = await env.d1.prepare(
    `SELECT
      u.id,
      u.created_at,
      u.last_login_at,
      p.summary,
      p.risk_score,
      p.stage,
      p.updated_at AS profile_updated_at,
      c.status,
      c.escalation_level,
      c.ai_reason,
      c.counselor_strategy,
      c.last_human_message_at,
      (SELECT COUNT(*) FROM task_events t WHERE t.user_id = u.id) AS task_count,
      (SELECT COUNT(*) FROM messages m WHERE m.user_id = u.id) AS message_count
     FROM users u
     LEFT JOIN user_profiles p ON p.user_id = u.id
     LEFT JOIN care_cases c ON c.user_id = u.id
     WHERE u.role = 'participant'
     ORDER BY
       CASE c.status WHEN 'active' THEN 0 WHEN 'suggested' THEN 1 ELSE 2 END,
       COALESCE(p.risk_score, -1) DESC,
       COALESCE(p.updated_at, u.created_at) DESC`,
  ).all();

  const copy = getResearchCopy(language);
  return json({
    users: (rows.results || []).map((row) => ({
      id: row.id,
      createdAt: row.created_at,
      lastLoginAt: row.last_login_at,
      summary: row.summary || copy.summaryPending,
      riskScore: row.risk_score,
      stage: row.stage || "orientation",
      stageLabel: copy.stage[row.stage || "orientation"] || row.stage || "orientation",
      status: row.status || "watch",
      statusLabel: copy.status[row.status || "watch"] || row.status || "watch",
      escalationLevel: row.escalation_level || "none",
      aiReason: row.ai_reason || "",
      counselorStrategy: row.counselor_strategy || "",
      lastHumanMessageAt: row.last_human_message_at || null,
      profileUpdatedAt: row.profile_updated_at || null,
      taskCount: row.task_count || 0,
      messageCount: row.message_count || 0,
    })),
  });
}

async function counselorUserCase(request, env, userId, url) {
  await requireCounselor(request, env);
  const normalized = normalizeUserId(userId);
  if (!normalized) return json({ error: "Invalid user ID." }, 400);
  const language = normalizeLanguage(url.searchParams.get("language"));
  const detail = await buildParticipantCase(env, normalized, language);
  return json(detail);
}

async function counselorMessage(request, env, userId) {
  await requireCounselor(request, env);
  const normalized = normalizeUserId(userId);
  if (!normalized) return json({ error: "Invalid user ID." }, 400);
  const body = await readJson(request);
  const language = normalizeLanguage(body.language);
  const message = String(body.message || "").trim();
  if (!message) return json({ error: "Message cannot be empty." }, 400);

  const now = new Date().toISOString();
  await insertMessage(env, normalized, "counselor", message, now, {});
  const current = await getCareCase(env, normalized);
  await upsertCareCase(env, normalized, {
    status: "active",
    escalation_level: "human",
    ai_reason: getResearchCopy(language).careReasons.human,
    counselor_strategy: current?.counselor_strategy || "",
    plan_json: current?.plan_json || "{}",
    last_human_message_at: now,
  });

  return counselorUserCase(request, env, normalized, new URL(`${request.url}?language=${language}`));
}

async function counselorStrategy(request, env, userId) {
  await requireCounselor(request, env);
  const normalized = normalizeUserId(userId);
  if (!normalized) return json({ error: "Invalid user ID." }, 400);
  const body = await readJson(request);
  const language = normalizeLanguage(body.language);
  const strategy = String(body.strategy || "").trim();
  const status = ["watch", "suggested", "active", "resolved"].includes(body.status)
    ? body.status
    : null;
  const current = await getCareCase(env, normalized);
  const now = new Date().toISOString();

  await upsertCareCase(env, normalized, {
    status: status || current?.status || "watch",
    escalation_level:
      status === "active"
        ? "human"
        : current?.escalation_level || "none",
    ai_reason: current?.ai_reason || getResearchCopy(language).careReasons.watch,
    counselor_strategy: strategy,
    plan_json: current?.plan_json || "{}",
    last_human_message_at: current?.last_human_message_at || null,
  });

  await insertMessage(
    env,
    normalized,
    "system",
    language === "zh" ? "顾问策略已更新。" : "Counselor strategy updated.",
    now,
    { strategy },
  );

  return counselorUserCase(request, env, normalized, new URL(`${request.url}?language=${language}`));
}

async function adminUsers(request, env, url) {
  await requireSuperAdmin(request, env);
  const language = normalizeLanguage(url.searchParams.get("language"));
  const rows = await env.d1.prepare(
    `SELECT
      u.id,
      u.role,
      u.created_at,
      u.last_login_at,
      p.risk_score,
      p.stage,
      c.status,
      (SELECT COUNT(*) FROM task_events t WHERE t.user_id = u.id) AS task_count,
      (SELECT COUNT(*) FROM messages m WHERE m.user_id = u.id) AS message_count
     FROM users u
     LEFT JOIN user_profiles p ON p.user_id = u.id
     LEFT JOIN care_cases c ON c.user_id = u.id
     ORDER BY
       CASE WHEN u.id = 'root' THEN 0 ELSE 1 END,
       CASE u.role WHEN 'superadmin' THEN 0 WHEN 'counselor' THEN 1 ELSE 2 END,
       u.id ASC`,
  ).all();

  const copy = getResearchCopy(language);
  return json({
    users: (rows.results || []).map((row) => ({
      id: row.id,
      role: publicRole(row),
      isSuperAdmin: isSuperAdmin(row),
      isCounselor: hasCounselorAccess(row),
      createdAt: row.created_at,
      lastLoginAt: row.last_login_at,
      riskScore: row.risk_score,
      stage: row.stage || "",
      status: row.status || "",
      statusLabel: row.status ? copy.status[row.status] || row.status : "",
      taskCount: row.task_count || 0,
      messageCount: row.message_count || 0,
    })),
  });
}

async function createAdminUser(request, env) {
  await requireSuperAdmin(request, env);
  const body = await readJson(request);
  const userId = normalizeUserId(body.userId);
  const password = String(body.password || "");

  if (!userId || userId === SUPERADMIN_ID) {
    return json({ error: "Please provide a valid non-root user ID." }, 400);
  }
  if (password.length < 4) {
    return json({ error: "Password must have at least 4 characters." }, 400);
  }

  const existing = await env.d1.prepare("SELECT id FROM users WHERE id = ?").bind(userId).first();
  if (existing) return json({ error: "User ID already exists." }, 409);

  const salt = randomHex(16);
  const passwordHash = await hashPassword(password, salt);
  const now = new Date().toISOString();
  const role = "counselor";

  await env.d1.prepare(
    "INSERT INTO users (id, role, password_hash, salt, created_at, last_login_at) VALUES (?, ?, ?, ?, ?, ?)",
  )
    .bind(userId, role, passwordHash, salt, now, now)
    .run();

  return json({ user: publicUser({ id: userId, role, created_at: now, last_login_at: now }, env) }, 201);
}

async function deleteAdminUser(request, env, userId) {
  await requireSuperAdmin(request, env);
  const normalized = normalizeUserId(userId);
  if (!normalized) return json({ error: "Invalid user ID." }, 400);

  const existing = await env.d1.prepare("SELECT id, role FROM users WHERE id = ?")
    .bind(normalized)
    .first();
  if (!existing) return json({ error: "User not found." }, 404);
  if (isSuperAdmin(existing)) {
    return json({ error: "Super administrator accounts cannot be deleted." }, 403);
  }

  await env.d1.prepare("DELETE FROM users WHERE id = ?").bind(normalized).run();

  return json({ ok: true, deletedUserId: normalized });
}

async function buildParticipantCase(env, userId, language) {
  const context = await loadParticipantContext(env, userId);
  const profile = buildProfile({
    events: context.events,
    messages: context.messages.filter((item) => item.role === "user"),
    careCase: context.careCase,
    snapshots: context.snapshots,
    language,
  });
  const careCase = deriveCareCase({
    profile,
    careCase: context.careCase,
    manualHelpRequested: false,
    snapshots: context.snapshots,
    language,
  });
  return {
    profile,
    careCase,
    messages: context.messages,
    tasks: buildTaskProgress(context.events, language),
    taskEvents: context.events.map((event) => summarizeTaskEvent(event, language)),
    snapshots: context.snapshots,
    visualization: buildVisualizationBundle({
      profile,
      snapshots: context.snapshots,
      careCase,
      language,
    }),
  };
}

async function refreshDerivedState(env, userId, language, options = {}) {
  const context = await loadParticipantContext(env, userId);
  const profile = buildProfile({
    events: context.events,
    messages: context.messages.filter((item) => item.role === "user"),
    careCase: context.careCase,
    snapshots: context.snapshots,
    language,
  });
  const careCase = deriveCareCase({
    profile,
    careCase: context.careCase,
    manualHelpRequested: Boolean(options.manualHelpRequested),
    snapshots: context.snapshots,
    language,
  });

  await upsertCareCase(env, userId, careCase);
  await saveProfile(env, userId, profile);
  await updateUserFeatures(env, userId, profile);
  await recordSnapshot(env, userId, profile, context.snapshots);

  return {
    profile,
    careCase,
    events: context.events,
    snapshots: await loadSnapshots(env, userId, 12),
  };
}

async function loadParticipantContext(env, userId) {
  const [messages, events, careCase, snapshots] = await Promise.all([
    loadMessages(env, userId, 120),
    loadTaskEvents(env, userId, 60),
    getCareCase(env, userId),
    loadSnapshots(env, userId, 12),
  ]);
  return { messages, events, careCase, snapshots };
}

async function loadMessages(env, userId, limit) {
  const rows = await env.d1.prepare(
    "SELECT role, content, metadata_json, created_at FROM messages WHERE user_id = ? ORDER BY created_at ASC LIMIT ?",
  )
    .bind(userId, limit)
    .all();
  return (rows.results || []).map((row) => ({
    role: row.role,
    content: row.content,
    metadata: parseJson(row.metadata_json || "{}", {}),
    created_at: row.created_at,
  }));
}

async function loadTaskEvents(env, userId, limit) {
  const rows = await env.d1.prepare(
    "SELECT task_key, payload_json, score_json, created_at FROM task_events WHERE user_id = ? ORDER BY created_at ASC LIMIT ?",
  )
    .bind(userId, limit)
    .all();
  return rows.results || [];
}

async function loadSnapshots(env, userId, limit) {
  const rows = await env.d1.prepare(
    "SELECT risk_score, stage, metrics_json, created_at FROM profile_snapshots WHERE user_id = ? ORDER BY created_at ASC LIMIT ?",
  )
    .bind(userId, limit)
    .all();
  return rows.results || [];
}

async function getCareCase(env, userId) {
  return env.d1.prepare(
    "SELECT status, escalation_level, ai_reason, counselor_strategy, plan_json, last_human_message_at, updated_at FROM care_cases WHERE user_id = ?",
  )
    .bind(userId)
    .first();
}

async function upsertCareCase(env, userId, careCase) {
  const now = new Date().toISOString();
  await env.d1.prepare(
    `INSERT INTO care_cases (user_id, status, escalation_level, ai_reason, counselor_strategy, plan_json, last_human_message_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(user_id) DO UPDATE SET
       status = excluded.status,
       escalation_level = excluded.escalation_level,
       ai_reason = excluded.ai_reason,
       counselor_strategy = excluded.counselor_strategy,
       plan_json = excluded.plan_json,
       last_human_message_at = excluded.last_human_message_at,
       updated_at = excluded.updated_at`,
  )
    .bind(
      userId,
      careCase.status,
      careCase.escalation_level,
      careCase.ai_reason,
      careCase.counselor_strategy || "",
      careCase.plan_json || "{}",
      careCase.last_human_message_at || null,
      now,
    )
    .run();
}

async function saveProfile(env, userId, profile) {
  const now = new Date().toISOString();
  await env.d1.prepare(
    `INSERT INTO user_profiles (user_id, profile_json, summary, risk_score, stage, updated_at)
     VALUES (?, ?, ?, ?, ?, ?)
     ON CONFLICT(user_id) DO UPDATE SET
       profile_json = excluded.profile_json,
       summary = excluded.summary,
       risk_score = excluded.risk_score,
       stage = excluded.stage,
       updated_at = excluded.updated_at`,
  )
    .bind(
      userId,
      JSON.stringify(profile),
      profile.summary,
      profile.risk_score,
      profile.stage,
      now,
    )
    .run();
}

async function recordSnapshot(env, userId, profile, existingSnapshots) {
  const latest = existingSnapshots?.at(-1);
  const metricsJson = JSON.stringify(profile.metrics || {});
  if (
    latest &&
    Number(latest.risk_score ?? -1) === Number(profile.risk_score ?? -1) &&
    String(latest.stage || "") === String(profile.stage || "") &&
    String(latest.metrics_json || "") === metricsJson
  ) {
    return;
  }

  await env.d1.prepare(
    "INSERT INTO profile_snapshots (id, user_id, risk_score, stage, metrics_json, created_at) VALUES (?, ?, ?, ?, ?, ?)",
  )
    .bind(
      crypto.randomUUID(),
      userId,
      profile.risk_score,
      profile.stage,
      metricsJson,
      new Date().toISOString(),
    )
    .run();
}

async function updateUserFeatures(env, userId, profile) {
  await env.d1.prepare("DELETE FROM user_features WHERE user_id = ?").bind(userId).run();
  const now = new Date().toISOString();
  const features = [
    ...toFeatureEntries("trigger", profile.triggers),
    ...toFeatureEntries("protective", profile.protective_factors),
    ...toFeatureEntries("move", profile.suggested_moves),
    ...toFeatureEntries("stage", [profile.stage]),
  ];

  for (const feature of features) {
    await env.d1.prepare(
      "INSERT INTO user_features (user_id, category, feature, last_seen_at) VALUES (?, ?, ?, ?)",
    )
      .bind(userId, feature.category, feature.feature, now)
      .run();
  }

  await recomputeCommonFeatures(env);
}

async function recomputeCommonFeatures(env) {
  await env.d1.prepare("DELETE FROM common_features").run();
  const rows = await env.d1.prepare(
    `SELECT category, feature, COUNT(DISTINCT user_id) AS count, MAX(last_seen_at) AS last_seen_at
     FROM user_features
     GROUP BY category, feature`,
  ).all();

  for (const row of rows.results || []) {
    await env.d1.prepare(
      "INSERT INTO common_features (category, feature, count, last_seen_at) VALUES (?, ?, ?, ?)",
    )
      .bind(row.category, row.feature, row.count, row.last_seen_at)
      .run();
  }
}

async function loadCommonFeatures(env) {
  const rows = await env.d1.prepare(
    "SELECT category, feature, count, last_seen_at FROM common_features ORDER BY count DESC, last_seen_at DESC LIMIT 20",
  ).all();
  return rows.results || [];
}

async function loadTotals(env) {
  return env.d1.prepare(
    `SELECT
      (SELECT COUNT(*) FROM users WHERE role = 'participant') AS participant_count,
      (SELECT COUNT(*) FROM user_profiles) AS profiled_count,
      (SELECT COUNT(*) FROM care_cases WHERE status = 'active') AS active_case_count,
      (SELECT COUNT(*) FROM care_cases WHERE status = 'suggested') AS suggested_case_count,
      (SELECT COUNT(*) FROM task_events) AS task_event_count,
      (SELECT COUNT(*) FROM messages) AS message_count`,
  ).first();
}

async function generateAssistantReply({ env, aiSettings, language, message, profile, careCase, messages, productSignals }) {
  const counselorStrategy = careCase?.counselor_strategy || "";
  if (aiSettings.requestUrl && aiSettings.model && aiSettings.apiKey) {
    try {
      return await callChatCompletion({
        requestUrl: aiSettings.requestUrl,
        model: aiSettings.model,
        apiKey: aiSettings.apiKey,
        systemPrompt: buildSystemPrompt({
          language,
          profile,
          careCase,
          counselorStrategy,
          productSignals,
        }),
        messages,
        userMessage: message,
      });
    } catch (error) {
      console.warn("AI provider failed, using fallback.", error);
    }
  }

  return generateFallbackReply({
    language,
    profile,
    careCase,
    counselorStrategy,
    message,
    productSignals,
  });
}

async function callChatCompletion({ requestUrl, model, apiKey, systemPrompt, messages, userMessage }) {
  const response = await fetch(toCompletionUrl(requestUrl), {
    method: "POST",
    headers: {
      authorization: `Bearer ${apiKey}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model,
      temperature: 0.45,
      messages: [
        { role: "system", content: systemPrompt },
        ...messages.slice(-8).map((item) => ({
          role: item.role === "assistant" ? "assistant" : "user",
          content: item.content,
        })),
        { role: "user", content: userMessage },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`AI provider error ${response.status}`);
  }
  const data = await response.json();
  const text = data?.choices?.[0]?.message?.content;
  if (!text) throw new Error("AI provider returned no content.");
  return String(text).trim();
}

async function fetchSharedPageSignals(message) {
  const urls = [...new Set((String(message || "").match(/https?:\/\/\S+/g) || []).map((item) => item.replace(/[),.;!?]+$/, "")))]
    .slice(0, 2);
  const signals = [];
  for (const url of urls) {
    try {
      const response = await fetch(url, {
        headers: {
          "user-agent": "AgentISResearchBot/1.0",
        },
      });
      if (!response.ok) continue;
      const html = await response.text();
      const title =
        matchMeta(html, /<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i) ||
        matchMeta(html, /<title>([^<]+)<\/title>/i) ||
        url;
      const price =
        matchMeta(html, /<meta[^>]+property=["']product:price:amount["'][^>]+content=["']([^"']+)["']/i) ||
        matchMeta(html, /"price"\s*:\s*"([^"]+)"/i) ||
        "";
      const currency =
        matchMeta(html, /<meta[^>]+property=["']product:price:currency["'][^>]+content=["']([^"']+)["']/i) ||
        matchMeta(html, /"priceCurrency"\s*:\s*"([^"]+)"/i) ||
        "";
      const summary = [title, price ? `${price} ${currency}`.trim() : ""].filter(Boolean).join(" | ");
      signals.push({ url, title, price, currency, summary });
    } catch (error) {
      console.warn("Page enrichment failed.", error);
    }
  }
  return signals;
}

async function getUserAiSettings(env, userId, revealSecret = false) {
  const row = await env.d1.prepare(
    "SELECT request_url, model, api_key, updated_at FROM user_ai_settings WHERE user_id = ?",
  )
    .bind(userId)
    .first();
  return sanitizeAiSettings(
    row
      ? {
          requestUrl: row.request_url,
          model: row.model,
          apiKey: row.api_key,
          updatedAt: row.updated_at,
        }
      : {
          requestUrl: String(env.AI_BASE_URL || ""),
          model: String(env.AI_MODEL || ""),
          apiKey: String(env.AI_API_KEY || env.DEEPSEEK_API_KEY || ""),
          updatedAt: null,
        },
    revealSecret,
  );
}

function sanitizeAiSettings(settings, revealSecret = false) {
  return {
    requestUrl: settings.requestUrl || "",
    model: settings.model || "",
    apiKey: revealSecret ? settings.apiKey || "" : "",
    hasApiKey: Boolean(settings.apiKey),
    updatedAt: settings.updatedAt || null,
  };
}

async function insertMessage(env, userId, role, content, createdAt, metadata) {
  await env.d1.prepare(
    "INSERT INTO messages (id, user_id, role, content, metadata_json, created_at) VALUES (?, ?, ?, ?, ?, ?)",
  )
    .bind(
      crypto.randomUUID(),
      userId,
      role,
      content,
      JSON.stringify(metadata || {}),
      createdAt,
    )
    .run();
}

async function requireCounselor(request, env) {
  const user = await requireUser(request, env);
  if (!hasCounselorAccess(user)) throw httpError("Counselor permission required.", 403);
  return user;
}

async function requireSuperAdmin(request, env) {
  const user = await requireUser(request, env);
  if (!isSuperAdmin(user)) throw httpError("Super administrator permission required.", 403);
  return user;
}

async function requireParticipant(request, env) {
  const user = await requireUser(request, env);
  if (user.role !== "participant") throw httpError("Participant account required.", 403);
  return user;
}

async function requireUser(request, env) {
  const token = readBearerToken(request);
  if (!token) throw httpError("Not authenticated.", 401);

  const session = await env.kv.get(sessionKey(token), "json");
  if (!session?.userId) throw httpError("Session expired.", 401);

  const user = await env.d1.prepare(
    "SELECT id, role, created_at, last_login_at FROM users WHERE id = ?",
  )
    .bind(session.userId)
    .first();
  if (!user) throw httpError("User not found.", 401);
  return user;
}

async function createSession(env, userId) {
  const token = randomHex(32);
  const ttl = Number(env.SESSION_TTL_SECONDS || DEFAULT_SESSION_TTL_SECONDS);
  const expiresAt = new Date(Date.now() + ttl * 1000).toISOString();
  await env.kv.put(
    sessionKey(token),
    JSON.stringify({ userId, expiresAt }),
    { expirationTtl: ttl },
  );
  return { token, expiresAt };
}

function sessionKey(token) {
  return `session:${token}`;
}

function readBearerToken(request) {
  const header = request.headers.get("authorization") || "";
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match?.[1] || "";
}

async function readJson(request) {
  try {
    return await request.json();
  } catch {
    throw httpError("Request body must be valid JSON.", 400);
  }
}

function publicUser(user, env) {
  return {
    id: user.id,
    role: publicRole(user),
    isCounselor: hasCounselorAccess(user),
    isSuperAdmin: isSuperAdmin(user),
    created_at: user.created_at || null,
    last_login_at: user.last_login_at || null,
  };
}

function roleForRegisteredUser(userId) {
  return String(userId || "") === SUPERADMIN_ID ? "counselor" : "participant";
}

function hasCounselorAccess(user) {
  return user?.role === "counselor" || isSuperAdmin(user);
}

function isSuperAdmin(user) {
  return user?.id === SUPERADMIN_ID || user?.role === "superadmin";
}

function publicRole(user) {
  return isSuperAdmin(user) ? "superadmin" : user.role;
}

function normalizeUserId(value) {
  const id = String(value || "").trim();
  return /^[a-zA-Z0-9_\-.@]{2,64}$/.test(id) ? id : "";
}

function normalizeRequestUrl(value) {
  const text = String(value || "").trim();
  if (!text || text.length > MAX_SETTINGS_URL_LENGTH) return "";
  try {
    const url = new URL(text);
    if (!["https:", "http:"].includes(url.protocol)) return "";
    return url.toString().replace(/\/$/, "");
  } catch {
    return "";
  }
}

function toCompletionUrl(requestUrl) {
  const base = requestUrl.replace(/\/$/, "");
  return base.endsWith("/chat/completions") ? base : `${base}/chat/completions`;
}

async function hashPassword(password, salt) {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(`${salt}:${password}`),
  );
  return arrayBufferToHex(digest);
}

function timingSafeEqual(left, right) {
  if (left.length !== right.length) return false;
  let diff = 0;
  for (let index = 0; index < left.length; index += 1) {
    diff |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }
  return diff === 0;
}

function randomHex(bytes) {
  const values = new Uint8Array(bytes);
  crypto.getRandomValues(values);
  return [...values].map((value) => value.toString(16).padStart(2, "0")).join("");
}

function arrayBufferToHex(buffer) {
  return [...new Uint8Array(buffer)].map((value) => value.toString(16).padStart(2, "0")).join("");
}

function toFeatureEntries(category, items) {
  return (Array.isArray(items) ? items : [])
    .map((feature) => String(feature || "").trim())
    .filter(Boolean)
    .map((feature) => ({ category, feature }));
}

function matchMeta(html, pattern) {
  return html.match(pattern)?.[1]?.trim() || "";
}

function parseJson(value, fallback) {
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: JSON_HEADERS });
}

function httpError(message, status) {
  return Object.assign(new Error(message), { status });
}
