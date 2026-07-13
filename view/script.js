import { I18N } from "./translation.js";

const TOKEN_KEY = "agentis_token";
const LANGUAGE_KEY = "agentis_language";
const THEME_KEY = "agentis_theme";
const prefersDarkQuery = window.matchMedia("(prefers-color-scheme: dark)");

const state = {
  mode: "login",
  token: localStorage.getItem(TOKEN_KEY) || "",
  language: localStorage.getItem(LANGUAGE_KEY) || "zh",
  theme: resolveTheme(),
  user: null,
  participantSection: "overview",
  tasks: [],
  taskProgress: [],
  messages: [],
  insights: null,
  aiSettings: null,
  counselorCases: [],
  adminUsers: [],
  selectedCaseId: "",
  selectedCase: null,
  pendingGeneration: null,
  pendingChatMessage: "",
};

const elements = {
  languageSelect: document.querySelector("#languageSelect"),
  themeSelect: document.querySelector("#themeSelect"),
  authView: document.querySelector("#authView"),
  participantView: document.querySelector("#participantView"),
  counselorView: document.querySelector("#counselorView"),
  authForm: document.querySelector("#authForm"),
  authSubmit: document.querySelector("#authSubmit"),
  authMessage: document.querySelector("#authMessage"),
  userIdInput: document.querySelector("#userIdInput"),
  passwordInput: document.querySelector("#passwordInput"),
  participantUserId: document.querySelector("#participantUserId"),
  workspaceTabs: document.querySelectorAll("[data-workspace-target]"),
  participantSections: document.querySelectorAll("[data-participant-section]"),
  focusTitle: document.querySelector("#focusTitle"),
  focusBody: document.querySelector("#focusBody"),
  focusTaskCount: document.querySelector("#focusTaskCount"),
  focusRisk: document.querySelector("#focusRisk"),
  focusCare: document.querySelector("#focusCare"),
  focusPrimaryButton: document.querySelector("#focusPrimaryButton"),
  focusThreadButton: document.querySelector("#focusThreadButton"),
  nextTaskTitle: document.querySelector("#nextTaskTitle"),
  nextTaskStatus: document.querySelector("#nextTaskStatus"),
  nextTaskSummary: document.querySelector("#nextTaskSummary"),
  nextTaskPreview: document.querySelector("#nextTaskPreview"),
  openTasksButton: document.querySelector("#openTasksButton"),
  overviewRiskValue: document.querySelector("#overviewRiskValue"),
  overviewStageValue: document.querySelector("#overviewStageValue"),
  overviewCareValue: document.querySelector("#overviewCareValue"),
  overviewSummaryText: document.querySelector("#overviewSummaryText"),
  overviewInsightsButton: document.querySelector("#overviewInsightsButton"),
  overviewSettingsButton: document.querySelector("#overviewSettingsButton"),
  taskProgressRail: document.querySelector("#taskProgressRail"),
  logoutButton: document.querySelector("#logoutButton"),
  counselorLogoutButton: document.querySelector("#counselorLogoutButton"),
  askCounselorButton: document.querySelector("#askCounselorButton"),
  exportButton: document.querySelector("#exportButton"),
  taskList: document.querySelector("#taskList"),
  messageThread: document.querySelector("#messageThread"),
  chatForm: document.querySelector("#chatForm"),
  messageInput: document.querySelector("#messageInput"),
  sendButton: document.querySelector("#sendButton"),
  aiStatusChip: document.querySelector("#aiStatusChip"),
  profileSummaryText: document.querySelector("#profileSummaryText"),
  theoryLineText: document.querySelector("#theoryLineText"),
  nextMoveText: document.querySelector("#nextMoveText"),
  riskBadge: document.querySelector("#riskBadge"),
  stageBadge: document.querySelector("#stageBadge"),
  careBadge: document.querySelector("#careBadge"),
  riskValue: document.querySelector("#riskValue"),
  stageValue: document.querySelector("#stageValue"),
  careValue: document.querySelector("#careValue"),
  careReasonText: document.querySelector("#careReasonText"),
  evidenceList: document.querySelector("#evidenceList"),
  bloomChart: document.querySelector("#bloomChart"),
  pathChart: document.querySelector("#pathChart"),
  milestoneList: document.querySelector("#milestoneList"),
  featureList: document.querySelector("#featureList"),
  aiSettingsForm: document.querySelector("#aiSettingsForm"),
  requestUrlInput: document.querySelector("#requestUrlInput"),
  modelInput: document.querySelector("#modelInput"),
  apiKeyInput: document.querySelector("#apiKeyInput"),
  saveAiButton: document.querySelector("#saveAiButton"),
  aiMessage: document.querySelector("#aiMessage"),
  passwordForm: document.querySelector("#passwordForm"),
  currentPasswordInput: document.querySelector("#currentPasswordInput"),
  newPasswordInput: document.querySelector("#newPasswordInput"),
  confirmPasswordInput: document.querySelector("#confirmPasswordInput"),
  savePasswordButton: document.querySelector("#savePasswordButton"),
  passwordMessage: document.querySelector("#passwordMessage"),
  refreshCasesButton: document.querySelector("#refreshCasesButton"),
  caseActiveCount: document.querySelector("#caseActiveCount"),
  caseSuggestedCount: document.querySelector("#caseSuggestedCount"),
  caseParticipantCount: document.querySelector("#caseParticipantCount"),
  caseList: document.querySelector("#caseList"),
  adminUserPanel: document.querySelector("#adminUserPanel"),
  createCounselorForm: document.querySelector("#createCounselorForm"),
  newCounselorIdInput: document.querySelector("#newCounselorIdInput"),
  newCounselorPasswordInput: document.querySelector("#newCounselorPasswordInput"),
  createCounselorButton: document.querySelector("#createCounselorButton"),
  createCounselorMessage: document.querySelector("#createCounselorMessage"),
  adminUserList: document.querySelector("#adminUserList"),
  emptyCaseState: document.querySelector("#emptyCaseState"),
  caseDetail: document.querySelector("#caseDetail"),
  caseUserId: document.querySelector("#caseUserId"),
  caseRiskBadge: document.querySelector("#caseRiskBadge"),
  caseStageBadge: document.querySelector("#caseStageBadge"),
  caseStatusBadge: document.querySelector("#caseStatusBadge"),
  caseSummaryText: document.querySelector("#caseSummaryText"),
  counselorBloomChart: document.querySelector("#counselorBloomChart"),
  counselorPathChart: document.querySelector("#counselorPathChart"),
  caseTaskEvents: document.querySelector("#caseTaskEvents"),
  caseMessageThread: document.querySelector("#caseMessageThread"),
  counselorMessageForm: document.querySelector("#counselorMessageForm"),
  counselorMessageInput: document.querySelector("#counselorMessageInput"),
  sendCounselorButton: document.querySelector("#sendCounselorButton"),
  counselorMessageFeedback: document.querySelector("#counselorMessageFeedback"),
  counselorStrategyForm: document.querySelector("#counselorStrategyForm"),
  counselorStrategyInput: document.querySelector("#counselorStrategyInput"),
  counselorStatusSelect: document.querySelector("#counselorStatusSelect"),
  saveStrategyButton: document.querySelector("#saveStrategyButton"),
  strategyFeedback: document.querySelector("#strategyFeedback"),
};

elements.languageSelect.value = state.language;
elements.themeSelect.value = state.theme;
applyTheme();
applyLanguage();

elements.languageSelect.addEventListener("change", async () => {
  state.language = elements.languageSelect.value;
  localStorage.setItem(LANGUAGE_KEY, state.language);
  applyLanguage();
  if (state.user) {
    if (state.user.isCounselor) await refreshCounselor();
    else await refreshParticipant();
  }
});

elements.themeSelect.addEventListener("change", () => {
  state.theme = elements.themeSelect.value;
  localStorage.setItem(THEME_KEY, state.theme);
  applyTheme();
});

const handleSystemThemeChange = (event) => {
  const savedTheme = localStorage.getItem(THEME_KEY);
  if (savedTheme === "dark" || savedTheme === "light") return;
  state.theme = event.matches ? "dark" : "light";
  elements.themeSelect.value = state.theme;
  applyTheme();
};

if (typeof prefersDarkQuery.addEventListener === "function") {
  prefersDarkQuery.addEventListener("change", handleSystemThemeChange);
} else if (typeof prefersDarkQuery.addListener === "function") {
  prefersDarkQuery.addListener(handleSystemThemeChange);
}

document.querySelectorAll(".tab").forEach((button) => {
  button.addEventListener("click", () => {
    state.mode = button.dataset.mode;
    document.querySelectorAll(".tab").forEach((item) => item.classList.toggle("active", item === button));
    elements.authSubmit.textContent = t(state.mode);
  });
});

elements.workspaceTabs.forEach((button) => {
  button.addEventListener("click", () => setParticipantSection(button.dataset.workspaceTarget));
});

elements.authForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  setBusy(elements.authSubmit, true);
  setFormMessage(elements.authMessage, "", "neutral");
  try {
    const result = await api(`/${state.mode}`, {
      method: "POST",
      body: {
        userId: elements.userIdInput.value,
        password: elements.passwordInput.value,
      },
      auth: false,
    });
    state.token = result.token;
    state.user = result.user;
    localStorage.setItem(TOKEN_KEY, state.token);
    await enterApp();
  } catch (error) {
    setFormMessage(elements.authMessage, error.message);
  } finally {
    setBusy(elements.authSubmit, false);
  }
});

elements.logoutButton.addEventListener("click", logout);
elements.counselorLogoutButton.addEventListener("click", logout);
elements.askCounselorButton.addEventListener("click", requestCounselor);
elements.exportButton.addEventListener("click", exportResearchPack);
elements.focusPrimaryButton.addEventListener("click", openFocusTarget);
elements.focusThreadButton.addEventListener("click", () => {
  setParticipantSection("thread");
  focusMessageInput();
});
elements.openTasksButton.addEventListener("click", openTasksSection);
elements.overviewInsightsButton.addEventListener("click", () => setParticipantSection("insights"));
elements.overviewSettingsButton.addEventListener("click", () => setParticipantSection("settings"));
elements.chatForm.addEventListener("submit", submitChatMessage);
elements.aiSettingsForm.addEventListener("submit", saveAiSettings);
elements.passwordForm.addEventListener("submit", submitPasswordChange);
elements.taskList.addEventListener("submit", handleTaskSubmit);
elements.taskList.addEventListener("input", handleTaskInput);
elements.refreshCasesButton.addEventListener("click", refreshCounselor);
elements.caseList.addEventListener("click", async (event) => {
  const card = event.target.closest("[data-user-id]");
  if (!card) return;
  await loadCounselorCase(card.dataset.userId);
});
elements.createCounselorForm.addEventListener("submit", createCounselorAccount);
elements.adminUserList.addEventListener("click", async (event) => {
  const button = event.target.closest("[data-delete-user-id]");
  if (!button) return;
  await deleteAdminUser(button.dataset.deleteUserId, button);
});
elements.counselorMessageForm.addEventListener("submit", submitCounselorMessage);
elements.counselorStrategyForm.addEventListener("submit", submitCounselorStrategy);

resumeSession();

async function resumeSession() {
  if (!state.token) return;
  try {
    const result = await api("/me");
    state.user = result.user;
    await enterApp();
  } catch {
    await logout({ silent: true });
  }
}

async function enterApp() {
  elements.authView.classList.add("hidden");
  if (state.user?.isCounselor) {
    elements.participantView.classList.add("hidden");
    elements.counselorView.classList.remove("hidden");
    await refreshCounselor();
    return;
  }
  elements.counselorView.classList.add("hidden");
  elements.participantView.classList.remove("hidden");
  elements.participantUserId.textContent = state.user?.id || "-";
  setParticipantSection("overview");
  await refreshParticipant();
}

async function refreshParticipant() {
  const [historyResult, taskResult, insightResult, aiSettingsResult] = await Promise.all([
    api("/history"),
    api(`/tasks?language=${encodeURIComponent(state.language)}`),
    api(`/insights?language=${encodeURIComponent(state.language)}`),
    api("/ai-settings"),
  ]);
  const visibleTasks = (taskResult.tasks || []).filter(isVisibleTask);
  const visibleTaskKeys = new Set(visibleTasks.map((task) => task.key));
  state.messages = filterVisibleMessages(historyResult.messages || []);
  state.tasks = visibleTasks;
  state.taskProgress = (taskResult.progress || []).filter((item) => visibleTaskKeys.has(item.key));
  state.insights = insightResult;
  state.aiSettings = aiSettingsResult.settings || null;
  renderParticipant();
}

function renderParticipant() {
  renderMessages(elements.messageThread, state.messages);
  renderTaskLab();
  renderAiSettings();
  renderInsights();
  renderParticipantOverview();
  setParticipantSection(state.participantSection);
}

function isVisibleTask(task) {
  return task?.kind !== "plan_prescription" && !isPrescriptionTaskKey(task?.key);
}

function filterVisibleMessages(messages) {
  return (messages || []).filter((message) => !isPrescriptionTaskKey(message?.metadata?.taskKey));
}

function isPrescriptionTaskKey(taskKey) {
  const key = String(taskKey || "");
  return key === "plan_craft" || key.startsWith("adaptive:plan:");
}

async function refreshCounselor() {
  const result = await api(`/counselor/cases?language=${encodeURIComponent(state.language)}`);
  state.counselorCases = result.users || [];
  renderCounselorCaseList();
  if (state.user?.isSuperAdmin) {
    const adminResult = await api(`/admin/users?language=${encodeURIComponent(state.language)}`);
    state.adminUsers = adminResult.users || [];
  } else {
    state.adminUsers = [];
  }
  renderAdminUserList();
  const activeCount = state.counselorCases.filter((item) => item.status === "active").length;
  const suggestedCount = state.counselorCases.filter((item) => item.status === "suggested").length;
  elements.caseActiveCount.textContent = `${t("activeCases")}: ${activeCount}`;
  elements.caseSuggestedCount.textContent = `${t("suggestedCases")}: ${suggestedCount}`;
  elements.caseParticipantCount.textContent = `${t("participants")}: ${state.counselorCases.length}`;

  if (state.counselorCases.length) {
    const targetId =
      state.selectedCaseId && state.counselorCases.some((item) => item.id === state.selectedCaseId)
        ? state.selectedCaseId
        : state.counselorCases[0].id;
    await loadCounselorCase(targetId);
  } else {
    state.selectedCaseId = "";
    state.selectedCase = null;
    renderCounselorDetail();
  }
}

async function loadCounselorCase(userId) {
  state.selectedCaseId = userId;
  state.selectedCase = await api(`/counselor/users/${encodeURIComponent(userId)}?language=${encodeURIComponent(state.language)}`);
  renderCounselorCaseList();
  renderCounselorDetail();
}

async function deleteAdminUser(userId, button) {
  if (!state.user?.isSuperAdmin || !userId) return;
  const confirmed = window.confirm(t("deleteAccountConfirm").replace("{id}", userId));
  if (!confirmed) return;
  setBusy(button, true);
  try {
    await api(`/admin/users/${encodeURIComponent(userId)}`, { method: "DELETE" });
    if (state.selectedCaseId === userId) {
      state.selectedCaseId = "";
      state.selectedCase = null;
    }
    await refreshCounselor();
  } catch (error) {
    window.alert(error.message);
  } finally {
    setBusy(button, false);
  }
}

async function createCounselorAccount(event) {
  event.preventDefault();
  if (!state.user?.isSuperAdmin) return;
  setBusy(elements.createCounselorButton, true);
  setFormMessage(elements.createCounselorMessage, "", "neutral");
  try {
    await api("/admin/users", {
      method: "POST",
      body: {
        userId: elements.newCounselorIdInput.value,
        password: elements.newCounselorPasswordInput.value,
      },
    });
    elements.newCounselorIdInput.value = "";
    elements.newCounselorPasswordInput.value = "";
    setFormMessage(elements.createCounselorMessage, t("counselorCreated"), "neutral");
    await refreshCounselor();
  } catch (error) {
    setFormMessage(elements.createCounselorMessage, error.message);
  } finally {
    setBusy(elements.createCounselorButton, false);
  }
}

async function logout(options = {}) {
  try {
    if (!options.silent) await api("/logout", { method: "POST" });
  } catch {
    // Ignore remote logout issues.
  }
  state.token = "";
  state.user = null;
  state.tasks = [];
  state.taskProgress = [];
  state.messages = [];
  state.insights = null;
  state.aiSettings = null;
  state.counselorCases = [];
  state.adminUsers = [];
  state.selectedCaseId = "";
  state.selectedCase = null;
  localStorage.removeItem(TOKEN_KEY);
  elements.authView.classList.remove("hidden");
  elements.participantView.classList.add("hidden");
  elements.counselorView.classList.add("hidden");
  elements.passwordInput.value = "";
  elements.currentPasswordInput.value = "";
  elements.newPasswordInput.value = "";
  elements.confirmPasswordInput.value = "";
  elements.newCounselorIdInput.value = "";
  elements.newCounselorPasswordInput.value = "";
  setFormMessage(elements.createCounselorMessage, "", "neutral");
  setFormMessage(elements.passwordMessage, "", "neutral");
}

function setParticipantSection(section) {
  const nextSection = ["overview", "tasks", "thread", "insights", "settings"].includes(section)
    ? section
    : "overview";
  state.participantSection = nextSection;

  elements.workspaceTabs.forEach((button) => {
    button.classList.toggle("active", button.dataset.workspaceTarget === nextSection);
  });
  elements.participantSections.forEach((sectionNode) => {
    sectionNode.classList.toggle("active", sectionNode.dataset.participantSection === nextSection);
  });
}

function openFocusTarget() {
  const focus = getParticipantFocus();
  if (focus.action === "task") {
    openTasksSection();
    return;
  }
  if (focus.action === "counselor") {
    requestCounselor();
    return;
  }
  if (focus.action === "insights") {
    setParticipantSection("insights");
    return;
  }
  setParticipantSection("thread");
  focusMessageInput();
}

function openTasksSection() {
  setParticipantSection("tasks");
  requestAnimationFrame(() => {
    const { task } = getNextTaskState();
    const selector = task ? `[data-task-card-key="${task.key}"]` : ".task-card";
    const target = elements.taskList.querySelector(selector);
    target?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

function focusMessageInput() {
  requestAnimationFrame(() => elements.messageInput.focus());
}

async function requestCounselor() {
  setBusy(elements.askCounselorButton, true);
  try {
    await api("/help", {
      method: "POST",
      body: { language: state.language },
    });
    await refreshParticipant();
    if (taskKey === "cue_triage") {
      setParticipantSection("overview");
      elements.participantView.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  } catch (error) {
    alert(error.message);
  } finally {
    setBusy(elements.askCounselorButton, false);
  }
}

async function exportResearchPack() {
  setBusy(elements.exportButton, true);
  try {
    const result = await api(`/research-export?language=${encodeURIComponent(state.language)}`);
    downloadText(
      result.filename || `agentis-${Date.now()}.json`,
      JSON.stringify(result, null, 2),
      "application/json",
    );
  } catch (error) {
    alert(error.message);
  } finally {
    setBusy(elements.exportButton, false);
  }
}

async function submitChatMessage(event) {
  event.preventDefault();
  const message = elements.messageInput.value.trim();
  if (!message) return;
  startAiGeneration("chat", message);
  setBusy(elements.sendButton, true, t("generatingReply"));
  try {
    await api("/chat", {
      method: "POST",
      body: { message, language: state.language },
    });
    elements.messageInput.value = "";
    await refreshParticipant();
  } catch (error) {
    alert(error.message);
  } finally {
    stopAiGeneration("chat");
    setBusy(elements.sendButton, false);
  }
}

async function saveAiSettings(event) {
  event.preventDefault();
  setBusy(elements.saveAiButton, true);
  setFormMessage(elements.aiMessage, "", "neutral");
  try {
    await api("/ai-settings", {
      method: "PUT",
      body: {
        requestUrl: elements.requestUrlInput.value,
        model: elements.modelInput.value,
        apiKey: elements.apiKeyInput.value,
      },
    });
    await refreshParticipant();
    setFormMessage(elements.aiMessage, t("configured"), "neutral");
  } catch (error) {
    setFormMessage(elements.aiMessage, error.message);
  } finally {
    setBusy(elements.saveAiButton, false);
  }
}

async function submitPasswordChange(event) {
  event.preventDefault();
  setBusy(elements.savePasswordButton, true);
  setFormMessage(elements.passwordMessage, "", "neutral");
  try {
    await api("/change-password", {
      method: "POST",
      body: {
        currentPassword: elements.currentPasswordInput.value,
        newPassword: elements.newPasswordInput.value,
        confirmPassword: elements.confirmPasswordInput.value,
      },
    });
    elements.currentPasswordInput.value = "";
    elements.newPasswordInput.value = "";
    elements.confirmPasswordInput.value = "";
    setFormMessage(elements.passwordMessage, t("changePassword"), "neutral");
  } catch (error) {
    setFormMessage(elements.passwordMessage, error.message);
  } finally {
    setBusy(elements.savePasswordButton, false);
  }
}

async function handleTaskSubmit(event) {
  event.preventDefault();
  const form = event.target.closest("form[data-task-key]");
  if (!form) return;
  const taskKey = form.dataset.taskKey;
  const payload = {
    language: state.language,
    ...serializeTaskForm(form, taskKey),
  };
  startAiGeneration("task");
  try {
    await api(`/tasks/${encodeURIComponent(taskKey)}`, {
      method: "POST",
      body: payload,
    });
    await refreshParticipant();
  } catch (error) {
    alert(error.message);
  } finally {
    stopAiGeneration("task");
  }
}

function handleTaskInput(event) {
  const form = event.target.closest("form[data-task-key='budget_arc']");
  if (!form) return;
  const total = ["immediate", "social", "comfort", "buffer", "future"]
    .map((name) => Number(form.elements[name].value || 0))
    .reduce((sum, value) => sum + value, 0);
  const totalNode = form.querySelector("[data-allocation-total]");
  if (totalNode) {
    totalNode.textContent = `${total} / 100`;
    totalNode.dataset.valid = total === 100 ? "true" : "false";
  }
}

async function submitCounselorMessage(event) {
  event.preventDefault();
  if (!state.selectedCaseId) return;
  const message = elements.counselorMessageInput.value.trim();
  if (!message) return;
  setBusy(elements.sendCounselorButton, true);
  setFormMessage(elements.counselorMessageFeedback, "", "neutral");
  try {
    state.selectedCase = await api(`/counselor/users/${encodeURIComponent(state.selectedCaseId)}/message`, {
      method: "POST",
      body: { message, language: state.language },
    });
    elements.counselorMessageInput.value = "";
    setFormMessage(elements.counselorMessageFeedback, t("sendCounselor"), "neutral");
    await refreshCounselor();
  } catch (error) {
    setFormMessage(elements.counselorMessageFeedback, error.message);
  } finally {
    setBusy(elements.sendCounselorButton, false);
  }
}

async function submitCounselorStrategy(event) {
  event.preventDefault();
  if (!state.selectedCaseId) return;
  setBusy(elements.saveStrategyButton, true);
  setFormMessage(elements.strategyFeedback, "", "neutral");
  try {
    state.selectedCase = await api(`/counselor/users/${encodeURIComponent(state.selectedCaseId)}/strategy`, {
      method: "PUT",
      body: {
        language: state.language,
        strategy: elements.counselorStrategyInput.value,
        status: elements.counselorStatusSelect.value,
      },
    });
    setFormMessage(elements.strategyFeedback, t("saveStrategy"), "neutral");
    await refreshCounselor();
  } catch (error) {
    setFormMessage(elements.strategyFeedback, error.message);
  } finally {
    setBusy(elements.saveStrategyButton, false);
  }
}

function renderTaskLab() {
  const progressMap = new Map(state.taskProgress.map((item) => [item.key, item]));
  const focusTask = getNextTaskState().task;
  const openTasks = focusTask ? [focusTask] : [];
  const taskContent = openTasks.length
    ? openTasks.map((task) => {
        const progress = progressMap.get(task.key);
        return renderTaskCard(task, progress, focusTask?.key === task.key);
      }).join("")
    : `<p class="summary-text">${escapeHtml(t("allTasksCompleteBody"))}</p>`;
  elements.taskList.innerHTML = `${renderGenerationNotice("task")}${taskContent}`;
}

function renderTaskCard(task, progress, isCurrent = false) {
  const status = progress?.statusLabel || "";
  const summary = progress?.summary || task.description;
  return `
    <article class="task-card${isCurrent ? " current-task" : ""}" data-task-card-key="${escapeHtml(task.key)}">
      <div class="task-card-head">
        <div>
          <h4>${escapeHtml(task.title)}</h4>
          ${renderBilingualSupport(task.titleSecondary, "task-title-secondary")}
          <p class="task-summary">${escapeHtml(task.theory)}</p>
          ${renderBilingualSupport(task.theorySecondary, "task-theory-secondary")}
        </div>
        <span class="status-chip">${escapeHtml(status)}</span>
      </div>
      <p class="task-summary">${escapeHtml(summary)}</p>
      ${renderBilingualSupport(task.descriptionSecondary, "task-description-secondary")}
      <div class="task-meta">
        <span class="meta-tag">${task.estimatedMinutes} min</span>
        <span class="meta-tag">${escapeHtml(taskKindLabel(task.kind))}</span>
      </div>
      ${renderTaskForm(task)}
    </article>
  `;
}

function renderParticipantOverview() {
  const focus = getParticipantFocus();
  const { task: nextTask, progress: nextProgress } = getNextTaskState();
  const profile = state.insights?.profile || {};
  const careCase = state.insights?.careCase || {};
  const completed = countCompletedTasks();
  const total = state.tasks.length || state.taskProgress.length;
  const taskCount = total ? `${completed}/${total}` : "-";
  const riskLabel = formatRisk(profile.risk_score, profile.risk_band);
  const careLabel = careCase?.status || "-";

  elements.focusTitle.textContent = focus.title;
  elements.focusBody.textContent = focus.body;
  elements.focusPrimaryButton.textContent = focus.buttonLabel;
  elements.focusTaskCount.textContent = taskCount;
  elements.focusRisk.textContent = riskLabel;
  elements.focusCare.textContent = careLabel;

  elements.nextTaskTitle.textContent = nextTask?.title || t("allTasksComplete");
  elements.nextTaskStatus.textContent = nextTask
    ? nextProgress?.statusLabel || t("pendingTasks")
    : t("completedTasks");
  elements.nextTaskSummary.textContent = nextTask
    ? nextProgress?.summary || nextTask.description
    : t("allTasksCompleteBody");
  elements.nextTaskPreview.innerHTML = renderNextTaskPreview(nextTask);
  elements.openTasksButton.textContent = nextTask ? t("openTasks") : t("reviewTasks");

  elements.overviewRiskValue.textContent = riskLabel;
  elements.overviewStageValue.textContent = profile.stage || "-";
  elements.overviewCareValue.textContent = careLabel;
  elements.overviewSummaryText.textContent = profile.summary || t("profilePending");

  renderTaskProgressRail(nextTask);
}

function renderNextTaskPreview(task) {
  if (!task) {
    return `<p class="summary-text">${escapeHtml(t("allTasksCompleteBody"))}</p>`;
  }
  return `
    <div class="task-meta">
      <span class="meta-tag">${task.estimatedMinutes} min</span>
      <span class="meta-tag">${escapeHtml(taskKindLabel(task.kind))}</span>
    </div>
    <p class="summary-text">${escapeHtml(task.theory || task.description)}</p>
  `;
}

function taskKindLabel(kind) {
  const labels = {
    micro_choices: t("taskKindMicroChoices"),
    scenes: t("taskKindScenes"),
    allocation: t("taskKindAllocation"),
    ladder: t("taskKindLadder"),
    plan: t("taskKindPlan"),
    plan_prescription: t("taskKindPlanPrescription"),
  };
  return labels[kind] || kind;
}

function renderTaskProgressRail(nextTask) {
  if (!state.tasks.length) {
    elements.taskProgressRail.innerHTML = `<p class="summary-text">${escapeHtml(t("taskLabBody"))}</p>`;
    return;
  }

  const progressMap = new Map(state.taskProgress.map((item) => [item.key, item]));
  elements.taskProgressRail.innerHTML = state.tasks
    .map((task, index) => {
      const progress = progressMap.get(task.key);
      const status = progress?.status || "pending";
      const isCurrent = nextTask?.key === task.key;
      return `
        <article class="task-progress-item ${escapeHtml(status)}${isCurrent ? " current" : ""}">
          <span class="progress-index">${index + 1}</span>
          <div>
            <strong>${escapeHtml(task.title)}</strong>
            <small>${escapeHtml(progress?.statusLabel || t("pendingTasks"))}</small>
          </div>
        </article>
      `;
    })
    .join("");
}

function getParticipantFocus() {
  const { task, progress } = getNextTaskState();
  const profile = state.insights?.profile || {};
  const careCase = state.insights?.careCase || {};
  const remaining = Math.max((state.tasks.length || 0) - countCompletedTasks(), 0);

  if (task) {
    const remainingText = remaining ? `${t("tasksRemaining")}: ${remaining}` : t("allTasksComplete");
    return {
      action: "task",
      title: task.title,
      body: `${progress?.summary || task.description} ${remainingText}`,
      buttonLabel: t("continueTask"),
    };
  }

  if (careCase?.status === "suggested") {
    return {
      action: "counselor",
      title: t("focusCounselorTitle"),
      body: careCase.ai_reason || t("focusCounselorBody"),
      buttonLabel: t("askCounselor"),
    };
  }

  if (profile.suggested_moves?.[0]) {
    return {
      action: "thread",
      title: t("focusThreadTitle"),
      body: profile.suggested_moves[0],
      buttonLabel: t("openThread"),
    };
  }

  return {
    action: "insights",
    title: t("focusReadyTitle"),
    body: t("focusReadyBody"),
    buttonLabel: t("reviewInsights"),
  };
}

function getNextTaskState() {
  const progressMap = new Map(state.taskProgress.map((item) => [item.key, item]));
  for (const task of state.tasks) {
    const progress = progressMap.get(task.key);
    if (progress?.status !== "completed") return { task, progress };
  }
  return { task: null, progress: null };
}

function countCompletedTasks() {
  return state.taskProgress.filter((item) => item.status === "completed").length;
}

function isTaskCompleted(task, progressMap) {
  return progressMap.get(task.key)?.status === "completed";
}

function renderTaskForm(task) {
  if (task.kind === "micro_choices") return renderMicroChoiceTask(task);
  if (task.kind === "scenes") return renderSceneTask(task);
  if (task.kind === "allocation") return renderAllocationTask(task);
  if (task.kind === "ladder") return renderDelayTask(task);
  if (task.kind === "plan_prescription") return renderPlanPrescriptionTask(task);
  return renderPlanTask(task);
}

function renderTaskSubmitButton(labelKey = "completeTask") {
  const waiting = state.pendingGeneration === "task";
  return `<button class="primary-button" type="submit"${waiting ? " disabled" : ""}>${escapeHtml(waiting ? t("generatingTask") : t(labelKey))}</button>`;
}

function renderMicroChoiceTask(task) {
  return `
    <form data-task-key="${task.key}">
      <div class="choice-stack">
        ${task.items.map((item, index) => `
          <section class="choice-row" data-choice-key="${escapeHtml(item.key)}">
            <div class="choice-prompt">
              <span>${index + 1}</span>
              <div>
                <strong>${escapeHtml(item.prompt)}</strong>
                ${renderBilingualSupport(item.promptSecondary)}
              </div>
            </div>
            ${renderMicroChoiceItemControl(item)}
          </section>
        `).join("")}
      </div>
      <div class="task-footer">
        <span class="mini-note">${escapeHtml(task.description)}</span>
        ${renderTaskSubmitButton()}
      </div>
    </form>
  `;
}

function renderMicroChoiceItemControl(item) {
  if (item.type === "fill_blank") {
    return `
      <textarea
        class="generated-answer"
        name="${escapeHtml(item.key)}"
        rows="3"
        maxlength="500"
        placeholder="${escapeHtml(item.placeholder || "")}"
        required></textarea>
      ${renderBilingualSupport(item.placeholderSecondary, "generated-answer-translation")}
    `;
  }

  return `
    <div class="choice-options">
      ${(item.options || []).map((option) => `
        <label class="option-pill compact">
          <input type="radio" name="${escapeHtml(item.key)}" value="${escapeHtml(option.key)}" required />
          <span class="option-copy">
            <span>${escapeHtml(option.label)}</span>
            ${renderBilingualSupport(option.labelSecondary)}
          </span>
        </label>
      `).join("")}
    </div>
  `;
}

function renderSceneTask(task) {
  return `
    <form data-task-key="${task.key}">
      <div class="scene-stack">
        ${task.scenes.map((scene) => `
          <section class="scene-card">
            <img src="${scene.art}" alt="${escapeHtml(scene.title)}" />
            <div>
              <strong>${escapeHtml(scene.title)}</strong>
              <p>${escapeHtml(scene.prompt)}</p>
            </div>
            <div class="option-list">
              ${scene.options.map((option) => `
                <label class="option-pill">
                  <input type="radio" name="${scene.key}" value="${option.key}" />
                  <span>${escapeHtml(option.label)}</span>
                </label>
              `).join("")}
            </div>
          </section>
        `).join("")}
      </div>
      <div class="task-footer">
        <span class="mini-note">${escapeHtml(task.description)}</span>
        ${renderTaskSubmitButton()}
      </div>
    </form>
  `;
}

function renderAllocationTask(task) {
  return `
    <form data-task-key="${task.key}">
      <div class="allocation-grid">
        ${task.jars.map((jar) => `
          <label>
            <span>${escapeHtml(jar.label)}</span>
            <input type="number" name="${jar.key}" min="0" max="100" step="1" value="20" />
          </label>
        `).join("")}
      </div>
      <div class="allocation-total" data-allocation-total>100 / 100</div>
      <div class="task-footer">
        <span class="mini-note">${escapeHtml(task.hint)}</span>
        ${renderTaskSubmitButton()}
      </div>
    </form>
  `;
}

function renderDelayTask(task) {
  return `
    <form data-task-key="${task.key}">
      <div class="ladder-stack">
        ${task.items.map((item, index) => `
          <section class="ladder-row">
            <strong>${index + 1}. ${escapeHtml(item.now)} / ${escapeHtml(item.later)}</strong>
            <div class="ladder-choices">
              <label class="option-pill">
                <input type="radio" name="${item.key}" value="now" />
                <span>${escapeHtml(item.now)}</span>
              </label>
              <label class="option-pill">
                <input type="radio" name="${item.key}" value="later" />
                <span>${escapeHtml(item.later)}</span>
              </label>
            </div>
          </section>
        `).join("")}
      </div>
      <div class="task-footer">
        <span class="mini-note">${escapeHtml(task.description)}</span>
        ${renderTaskSubmitButton()}
      </div>
    </form>
  `;
}

function renderPlanTask(task) {
  return `
    <form data-task-key="${task.key}">
      <div class="plan-grid">
        <label>
          <span>${escapeHtml(t("nextMove"))}</span>
          <select name="goal">
            <option value=""></option>
            ${task.goals.map((item) => `<option value="${item.key}">${escapeHtml(item.label)}</option>`).join("")}
          </select>
        </label>
        <label>
          <span>${escapeHtml(t("risk"))}</span>
          <select name="trigger">
            <option value=""></option>
            ${task.triggers.map((item) => `<option value="${item.key}">${escapeHtml(item.label)}</option>`).join("")}
          </select>
        </label>
        <label>
          <span>${escapeHtml(t("milestoneLadder"))}</span>
          <select name="action">
            <option value=""></option>
            ${task.actions.map((item) => `<option value="${item.key}">${escapeHtml(item.label)}</option>`).join("")}
          </select>
        </label>
        <label>
          <span>${escapeHtml(t("careStatus"))}</span>
          <select name="support">
            <option value=""></option>
            ${task.supports.map((item) => `<option value="${item.key}">${escapeHtml(item.label)}</option>`).join("")}
          </select>
        </label>
        <label class="full">
          <span>Horizon</span>
          <select name="horizonDays">
            ${task.horizon.map((item) => `<option value="${item.key}">${escapeHtml(item.label)}</option>`).join("")}
          </select>
        </label>
        ${task.milestoneLabels.map((label, index) => `
          <label class="full">
            <span>${escapeHtml(label)}</span>
            <input name="step${index + 1}" />
          </label>
        `).join("")}
      </div>
      <div class="task-footer">
        <span class="mini-note">${escapeHtml(task.description)}</span>
        ${renderTaskSubmitButton()}
      </div>
    </form>
  `;
}

function renderPlanPrescriptionTask(task) {
  const plan = task.prescription || {};
  const steps = Array.isArray(plan.steps) ? plan.steps : [];
  const fields = [
    [t("prescribedGoal"), plan.goalLabel],
    [t("prescribedTrigger"), plan.triggerLabel],
    [t("prescribedAction"), plan.actionLabel],
    [t("prescribedSupport"), plan.supportLabel],
    [t("prescriptionHorizon"), plan.horizonLabel],
  ].filter(([, value]) => value);

  return `
    <form data-task-key="${task.key}" data-task-kind="plan_prescription">
      <section class="prescription-panel">
        <div class="prescription-head">
          <span class="status-chip ready">${escapeHtml(t("aiPrescription"))}</span>
          <strong>${escapeHtml(plan.goalLabel || task.title)}</strong>
          <p>${escapeHtml(plan.rationale || task.description)}</p>
        </div>
        <div class="prescription-grid">
          ${fields.map(([label, value]) => `
            <div class="prescription-item">
              <span>${escapeHtml(label)}</span>
              <strong>${escapeHtml(value)}</strong>
            </div>
          `).join("")}
        </div>
        <ol class="prescription-steps">
          ${steps.map((step) => `<li>${escapeHtml(step)}</li>`).join("")}
        </ol>
      </section>
      <div class="task-footer">
        <span class="mini-note">${escapeHtml(task.description)}</span>
        ${renderTaskSubmitButton("confirmPrescription")}
      </div>
    </form>
  `;
}

function renderInsights() {
  if (!state.insights?.profile) return;
  const { profile, careCase, visualization, commonFeatures, aiConfigured } = state.insights;

  elements.profileSummaryText.textContent = profile.summary || "-";
  elements.theoryLineText.textContent = profile.theoryLine || "-";
  elements.nextMoveText.textContent = profile.suggested_moves?.[0] || t("taskLab");
  elements.riskValue.textContent = formatRisk(profile.risk_score, profile.risk_band);
  elements.stageValue.textContent = profile.stage || "-";
  elements.careValue.textContent = careCase?.status || "-";
  elements.careReasonText.textContent = careCase?.ai_reason || "-";

  elements.riskBadge.textContent = `${t("risk")}: ${formatRisk(profile.risk_score, profile.risk_band)}`;
  elements.stageBadge.textContent = `${t("stage")}: ${profile.stage || "-"}`;
  elements.careBadge.textContent = `${t("careStatus")}: ${careCase?.status || "-"}`;

  elements.aiStatusChip.textContent = aiConfigured ? t("configured") : t("notConfigured");
  elements.aiStatusChip.classList.toggle("ready", Boolean(aiConfigured));

  elements.evidenceList.innerHTML = (profile.evidence || [])
    .map((item) => `<li>${escapeHtml(item)}</li>`)
    .join("");

  if (!commonFeatures?.length) {
    elements.featureList.innerHTML = `<p class="summary-text">${escapeHtml(t("noFeatures"))}</p>`;
  } else {
    elements.featureList.innerHTML = commonFeatures
      .map((item) => `
        <article class="feature-item">
          <div>
            <strong>${escapeHtml(item.feature)}</strong>
            <small>${escapeHtml(item.category)}</small>
          </div>
          <span class="feature-count">${item.count}</span>
        </article>
      `)
      .join("");
  }

  renderBloomChart(elements.bloomChart, visualization?.bloom || [], profile.risk_score);
  renderPathChart(elements.pathChart, visualization?.path || []);
  renderMilestones(elements.milestoneList, visualization?.milestones || [], careCase);
}

function renderAiSettings() {
  const settings = state.aiSettings || {};
  elements.requestUrlInput.value = settings.requestUrl || "";
  elements.modelInput.value = settings.model || "";
  elements.apiKeyInput.value = settings.apiKey || "";
  setFormMessage(elements.aiMessage, settings.hasApiKey ? t("configured") : t("notConfigured"), "neutral");
}

function renderMessages(container, messages) {
  const visibleMessages =
    container === elements.messageThread && state.pendingGeneration === "chat" && state.pendingChatMessage
      ? [...(messages || []), { role: "user", content: state.pendingChatMessage }]
      : messages || [];

  container.innerHTML = visibleMessages
    .map((message) => `
      <article class="message ${escapeHtml(message.role)}">
        <span class="message-role">${escapeHtml(roleLabel(message.role))}</span>
        <div class="message-bubble">${escapeHtml(message.content)}</div>
      </article>
    `)
    .join("") + (container === elements.messageThread ? renderGenerationNotice("chat") : "");
  container.scrollTop = container.scrollHeight;
}

function renderCounselorCaseList() {
  elements.caseList.innerHTML = state.counselorCases
    .map((item) => `
      <article class="case-card${item.id === state.selectedCaseId ? " active" : ""}" data-user-id="${escapeHtml(item.id)}">
        <div class="case-card-head">
          <h4>${escapeHtml(item.id)}</h4>
          <span class="status-chip">${escapeHtml(item.statusLabel)}</span>
        </div>
        <p>${escapeHtml(item.summary)}</p>
        <div class="case-card-meta">
          <small>${escapeHtml(t("risk"))}: ${escapeHtml(formatRisk(item.riskScore, item.riskScore))}</small>
          <small>${escapeHtml(t("taskCount"))}: ${item.taskCount}</small>
        </div>
      </article>
    `)
    .join("");
}

function renderAdminUserList() {
  elements.adminUserPanel.classList.toggle("hidden", !state.user?.isSuperAdmin);
  if (!state.user?.isSuperAdmin) {
    elements.adminUserList.innerHTML = "";
    return;
  }
  elements.adminUserList.innerHTML = state.adminUsers
    .map((item) => `
      <article class="admin-user-row">
        <div>
          <strong>${escapeHtml(item.id)}</strong>
          <span>${escapeHtml(t(item.role) || item.role)}</span>
        </div>
        <div class="admin-user-meta">
          <small>${escapeHtml(t("messageCount"))}: ${item.messageCount}</small>
          <small>${escapeHtml(t("taskCount"))}: ${item.taskCount}</small>
          ${item.isSuperAdmin
            ? `<small class="protected-account">${escapeHtml(t("protectedAccount"))}</small>`
            : `<button class="ghost-button danger-button" type="button" data-delete-user-id="${escapeHtml(item.id)}">
                ${escapeHtml(t("deleteAccount"))}
              </button>`}
        </div>
      </article>
    `)
    .join("") || `<p class="summary-text">${escapeHtml(t("noAccounts"))}</p>`;
}

function renderCounselorDetail() {
  if (!state.selectedCase) {
    elements.emptyCaseState.classList.remove("hidden");
    elements.caseDetail.classList.add("hidden");
    return;
  }

  const { profile, careCase, taskEvents, messages, visualization } = state.selectedCase;
  elements.emptyCaseState.classList.add("hidden");
  elements.caseDetail.classList.remove("hidden");
  elements.caseUserId.textContent = state.selectedCaseId;
  elements.caseRiskBadge.textContent = `${t("risk")}: ${formatRisk(profile.risk_score, profile.risk_band)}`;
  elements.caseStageBadge.textContent = `${t("stage")}: ${profile.stage || "-"}`;
  elements.caseStatusBadge.textContent = `${t("careStatus")}: ${careCase.status || "-"}`;
  elements.caseSummaryText.textContent = profile.summary || "-";
  elements.counselorStrategyInput.value = careCase.counselor_strategy || "";
  elements.counselorStatusSelect.value = careCase.status || "watch";

  elements.caseTaskEvents.innerHTML = (taskEvents || [])
    .map((item) => `<li><strong>${escapeHtml(item.title)}:</strong> ${escapeHtml(item.summary)}</li>`)
    .join("");

  renderMessages(elements.caseMessageThread, messages || []);
  renderBloomChart(elements.counselorBloomChart, visualization?.bloom || [], profile.risk_score);
  renderPathChart(elements.counselorPathChart, visualization?.path || []);
}

function renderMilestones(container, milestones, careCase) {
  if (!milestones.length) {
    container.innerHTML = `<p class="summary-text">${escapeHtml(careCase?.ai_reason || t("taskLabBody"))}</p>`;
    return;
  }
  container.innerHTML = `
    <div class="milestone-stack">
      ${milestones.map((item) => `
        <article class="milestone-item${item.status === "current" ? " current" : ""}">
          <strong>${escapeHtml(item.label)}</strong>
        </article>
      `).join("")}
      <p class="summary-text">${escapeHtml(careCase?.ai_reason || "")}</p>
    </div>
  `;
}

function renderBloomChart(container, bloom, riskScore) {
  if (!bloom.length) {
    container.innerHTML = `<p class="summary-text">-</p>`;
    return;
  }

  const gradientId = `${container.id || "bloom"}Gradient`;
  const cx = 190;
  const cy = 190;
  const petals = bloom.map((item, index) => {
    const angle = ((Math.PI * 2) / bloom.length) * index - Math.PI / 2;
    const length = 62 + (Number(item.value || 0) / 100) * 96;
    const width = 20 + (Number(item.value || 0) / 100) * 20;
    const x1 = cx + Math.cos(angle - 0.28) * width;
    const y1 = cy + Math.sin(angle - 0.28) * width;
    const x2 = cx + Math.cos(angle) * length;
    const y2 = cy + Math.sin(angle) * length;
    const x3 = cx + Math.cos(angle + 0.28) * width;
    const y3 = cy + Math.sin(angle + 0.28) * width;
    const labelX = cx + Math.cos(angle) * (length + 28);
    const labelY = cy + Math.sin(angle) * (length + 28);
    return `
      <path d="M ${cx} ${cy} Q ${x1} ${y1} ${x2} ${y2} Q ${x3} ${y3} ${cx} ${cy} Z"
        fill="url(#${gradientId})" stroke="var(--chart-palette-2)" stroke-width="2" opacity="0.86" />
      <text x="${labelX}" y="${labelY}" text-anchor="middle" dominant-baseline="middle" font-size="12" fill="currentColor">${escapeHtml(item.label)}</text>
    `;
  }).join("");

  container.innerHTML = `
    <svg class="bloom-svg" viewBox="0 0 380 380" role="img" aria-label="Intervention bloom">
      <defs>
        <linearGradient id="${gradientId}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="var(--chart-palette-1)" />
          <stop offset="100%" stop-color="var(--chart-palette-2)" />
        </linearGradient>
      </defs>
      <g style="color: var(--text)">
        ${petals}
        <circle cx="${cx}" cy="${cy}" r="54" fill="var(--surface-dark)" stroke="var(--line)" stroke-width="3" />
        <text x="${cx}" y="${cy - 6}" text-anchor="middle" font-size="14" fill="var(--muted)">Risk</text>
        <text x="${cx}" y="${cy + 18}" text-anchor="middle" font-size="28" font-weight="800" fill="var(--text)">${escapeHtml(String(riskScore ?? "-"))}</text>
      </g>
    </svg>
  `;
}

function renderPathChart(container, path) {
  if (!path.length) {
    container.innerHTML = `<p class="summary-text">-</p>`;
    return;
  }
  const gradientId = `${container.id || "path"}Gradient`;
  const width = 420;
  const height = 220;
  const padding = 28;
  const points = path.map((item, index) => {
    const x = padding + (index / Math.max(path.length - 1, 1)) * (width - padding * 2);
    const y = height - padding - ((Number(item.risk || 0) / 100) * (height - padding * 2));
    return { ...item, x, y };
  });
  const linePath = points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ");
  container.innerHTML = `
    <svg class="path-svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="Progress path">
      <path d="M ${padding} ${height - padding} H ${width - padding}" stroke="var(--chart-grid)" stroke-width="1.4" fill="none" />
      <path d="M ${padding} ${padding} V ${height - padding}" stroke="var(--chart-grid)" stroke-width="1.4" fill="none" />
      <path d="${linePath}" stroke="url(#${gradientId})" stroke-width="4" fill="none" stroke-linecap="round" />
      <defs>
        <linearGradient id="${gradientId}" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="var(--chart-palette-1)" />
          <stop offset="100%" stop-color="var(--chart-palette-2)" />
        </linearGradient>
      </defs>
      ${points.map((point) => `
        <g>
          <circle cx="${point.x}" cy="${point.y}" r="5.5" fill="var(--surface-dark)" stroke="var(--chart-palette-1)" stroke-width="3" />
          <text x="${point.x}" y="${height - 6}" text-anchor="middle" font-size="11" fill="var(--muted)">${escapeHtml(point.label)}</text>
        </g>
      `).join("")}
    </svg>
  `;
}

function serializeTaskForm(form, taskKey) {
  if (form.dataset.taskKind === "plan_prescription") {
    return { confirmed: true };
  }
  if (form.querySelector("[data-choice-key]")) {
    return Object.fromEntries(
      [...form.querySelectorAll("[data-choice-key]")]
        .map((node) => {
          const key = node.dataset.choiceKey;
          const textControl = node.querySelector("textarea, input[type='text']");
          return [key, textControl ? textControl.value.trim() : selectedRadioValue(form, key)];
        }),
    );
  }
  if (taskKey === "budget_arc") {
    return {
      immediate: numericField(form, "immediate"),
      social: numericField(form, "social"),
      comfort: numericField(form, "comfort"),
      buffer: numericField(form, "buffer"),
      future: numericField(form, "future"),
    };
  }
  if (taskKey === "delay_ladder") {
    return {
      q1: selectedRadioValue(form, "q1"),
      q2: selectedRadioValue(form, "q2"),
      q3: selectedRadioValue(form, "q3"),
      q4: selectedRadioValue(form, "q4"),
      q5: selectedRadioValue(form, "q5"),
    };
  }
  return {
    goal: form.elements.goal?.value || "",
    trigger: form.elements.trigger?.value || "",
    action: form.elements.action?.value || "",
    support: form.elements.support?.value || "",
    horizonDays: Number(form.elements.horizonDays?.value || 30),
    step1: form.elements.step1?.value || "",
    step2: form.elements.step2?.value || "",
    step3: form.elements.step3?.value || "",
  };
}

function selectedRadioValue(form, name) {
  return form.querySelector(`input[name="${name}"]:checked`)?.value || "";
}

function numericField(form, name) {
  return Number(form.elements[name].value || 0);
}

function roleLabel(role) {
  const isZh = state.language === "zh";
  if (role === "user") return isZh ? "参与者" : "Participant";
  if (role === "assistant") return "AgentIS";
  if (role === "counselor") return isZh ? "顾问" : "Counselor";
  return isZh ? "系统" : "System";
}

function formatRisk(value, fallback) {
  if (value === null || value === undefined) return fallback || "-";
  return `${value}`;
}

function applyLanguage() {
  document.documentElement.lang = state.language === "zh" ? "zh-CN" : "en";
  document.querySelectorAll("[data-i18n]").forEach((node) => {
    node.textContent = t(node.dataset.i18n);
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((node) => {
    node.placeholder = t(node.dataset.i18nPlaceholder);
  });
  elements.authSubmit.textContent = t(state.mode);
  elements.aiStatusChip.textContent = state.insights?.aiConfigured ? t("configured") : t("notConfigured");
  if (state.user) {
    if (state.user.isCounselor) {
      renderCounselorDetail();
      renderAdminUserList();
    }
    else renderParticipant();
  }
}

function applyTheme() {
  document.documentElement.dataset.theme = state.theme;
  document.documentElement.style.colorScheme = state.theme;
}

function resolveTheme() {
  const savedTheme = localStorage.getItem(THEME_KEY);
  if (savedTheme === "dark" || savedTheme === "light") return savedTheme;
  return prefersDarkQuery.matches ? "dark" : "light";
}

function t(key) {
  return I18N[state.language]?.[key] || I18N.en[key] || key;
}

async function api(path, options = {}) {
  const init = {
    method: options.method || "GET",
    headers: { "content-type": "application/json" },
  };
  if (options.body) init.body = JSON.stringify(options.body);
  if (options.auth !== false && state.token) {
    init.headers.authorization = `Bearer ${state.token}`;
  }
  const response = await fetch(`/api${path}`, init);
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || t("requestFailed"));
  return data;
}

function setBusy(button, busy, busyText = "...") {
  if (!button) return;
  button.disabled = busy;
  if (busy) {
    button.dataset.originalText = button.textContent;
    button.textContent = busyText;
  } else {
    button.textContent = button.dataset.originalText || button.textContent;
    delete button.dataset.originalText;
  }
}

function startAiGeneration(type, pendingChatMessage = "") {
  state.pendingGeneration = type;
  state.pendingChatMessage = pendingChatMessage;
  renderAiGenerationState();
}

function stopAiGeneration(type) {
  if (state.pendingGeneration !== type) return;
  state.pendingGeneration = null;
  state.pendingChatMessage = "";
  renderAiGenerationState();
}

function renderAiGenerationState() {
  if (!state.user || state.user.isCounselor) return;
  renderMessages(elements.messageThread, state.messages);
  renderTaskLab();
}

function renderGenerationNotice(type) {
  if (state.pendingGeneration !== type) return "";
  const titleKey = type === "chat" ? "generatingReply" : "generatingTask";
  const detailKey = type === "chat" ? "generatingReplyDetail" : "generatingTaskDetail";
  const role = type === "chat" ? roleLabel("assistant") : t("taskLab");
  return `
    <article class="generation-notice ${escapeHtml(type)}" role="status" aria-live="polite">
      <span class="generation-spinner" aria-hidden="true"></span>
      <div>
        <span class="message-role">${escapeHtml(role)}</span>
        <strong>${escapeHtml(t(titleKey))}</strong>
        <p>${escapeHtml(t(detailKey))}</p>
      </div>
    </article>
  `;
}

function renderBilingualSupport(text, className = "bilingual-support") {
  if (!text) return "";
  const language = state.language === "zh" ? "en" : "zh-CN";
  return `<span class="${escapeHtml(className)} bilingual-support" lang="${language}">${escapeHtml(text)}</span>`;
}

function setFormMessage(node, text, tone = "error") {
  node.textContent = text;
  node.classList.toggle("neutral", tone === "neutral");
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function downloadText(filename, text, type) {
  const blob = new Blob([text], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}
