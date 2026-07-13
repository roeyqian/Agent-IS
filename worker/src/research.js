const SUPPORTED_LANGUAGES = new Set(["zh", "en"]);

export const METRIC_KEYS = [
  "cue_drive",
  "emotion_relief",
  "social_pull",
  "present_bias",
  "planning_strength",
  "help_readiness",
];

const UI_COPY = {
  en: {
    protocolId: "AgentIS-CHI-2027",
    protocolName: "Agentic Indirect Sensing for Overspending",
    theoryLine:
      "Combines cue-reactivity, delay discounting, implementation intentions, and stepped-care escalation.",
    stage: {
      orientation: "Orientation",
      sensing: "Indirect sensing",
      mapping: "Pattern mapping",
      intervening: "Intervention active",
      stabilizing: "Stabilizing",
    },
    status: {
      watch: "Watch",
      suggested: "Suggested handoff",
      active: "Counselor active",
      resolved: "Resolved",
    },
    escalation: {
      none: "None",
      recommended: "Recommended",
      urgent: "Urgent",
      human: "Human-led",
    },
    metrics: {
      cue_drive: "Cue pull",
      emotion_relief: "Mood buying",
      social_pull: "Social pull",
      present_bias: "Present bias",
      planning_strength: "Planning strength",
      help_readiness: "Help openness",
    },
    labels: {
      riskHigh: "High risk",
      riskMedium: "Moderate risk",
      riskLow: "Low risk",
      riskPending: "Pending",
      nextMove: "Next move",
      bloomTitle: "Intervention Bloom",
      pathTitle: "Progress path",
      milestoneTitle: "Milestone ladder",
      evidenceTitle: "Evidence chain",
    },
    summaryPending:
      "No indirect evidence yet. The system is waiting for multimodal tasks rather than a direct questionnaire.",
    nextMoves: {
      cue_triage: "Complete the daily rhythm micro-choice check",
      budget_arc: "Map how attention splits across reward vs buffer",
      delay_ladder: "Probe present-bias with the horizon ladder",
      plan_craft: "Turn the pattern into a concrete next step",
      counselor: "Invite the counselor to co-shape the intervention",
    },
    evidenceNotes: {
      cue_triage: "Ten low-friction micro-choices",
      adaptive: "Adaptive test content",
      budget_arc: "Token allocation across reward and buffer jars",
      delay_ladder: "Delay-discounting preference ladder",
      plan_craft: "Next-step plan artifact",
      message_regret: "Spontaneous regret / loss-of-control language",
      message_guard: "Self-control / buffering language",
      url_signal: "Shared shopping link enriched with page context",
    },
    taskStatus: {
      pending: "Pending",
      completed: "Completed",
    },
    careReasons: {
      urgent:
        "Risk remains elevated and a human counselor should review the case.",
      recommended:
        "Risk or stagnation suggests a counselor could fine-tune the intervention strategy.",
      watch:
        "The system can continue sensing and coaching without counselor handoff for now.",
      human:
        "A counselor is already in the loop and can adjust the plan directly.",
    },
    suggestedMoves: {
      delay_rule: "Use a 24-hour cooling rule before acting on price drops.",
      social_buffer: "Add a verification pause before social-proof purchases.",
      mood_detour: "Prepare a non-shopping mood reset for late-night browsing.",
      friction_stack: "Place budget and wish-list friction before checkout.",
      counselor_join: "Let a counselor monitor milestones and revise the strategy.",
    },
    protectiveFactors: {
      buffer: "Keeps budget buffer visible",
      future: "Maintains a future-goal anchor",
      planning: "Follows a concrete plan instead of vague intentions",
      support: "Open to human or peer accountability",
      reflection: "Uses reflection before checkout",
    },
    triggerLabels: {
      countdown: "Time-window sensitivity",
      mood_relief: "Restorative affect orientation",
      social_proof: "Social-signal sensitivity",
      instant_reward: "Immediate-reward orientation",
      recommendation: "Novelty-cue sensitivity",
    },
  },
  zh: {
    protocolId: "AgentIS-CHI-2027",
    protocolName: "Agentic Indirect Sensing for Overspending",
    theoryLine:
      "结合线索反应、延迟折扣、实施意图与分级人工介入，不靠直接问卷识别过度消费风险。",
    stage: {
      orientation: "引导阶段",
      sensing: "间接感知",
      mapping: "模式建模",
      intervening: "干预进行中",
      stabilizing: "稳定阶段",
    },
    status: {
      watch: "持续观察",
      suggested: "建议顾问接入",
      active: "顾问已接管",
      resolved: "已处理",
    },
    escalation: {
      none: "无",
      recommended: "建议升级",
      urgent: "紧急升级",
      human: "人工主导",
    },
    metrics: {
      cue_drive: "线索拉力",
      emotion_relief: "情绪性购买",
      social_pull: "社会影响",
      present_bias: "即时偏好",
      planning_strength: "计划强度",
      help_readiness: "求助开放度",
    },
    labels: {
      riskHigh: "高风险",
      riskMedium: "中风险",
      riskLow: "低风险",
      riskPending: "待判定",
      nextMove: "下一步",
      bloomTitle: "干预花谱",
      pathTitle: "进展路径",
      milestoneTitle: "里程碑阶梯",
      evidenceTitle: "证据链",
    },
    summaryPending:
      "系统还没有足够的间接证据。当前优先通过多模态任务而不是直接问卷来建立行为画像。",
    nextMoves: {
      cue_triage: "先完成日常节奏微选择",
      budget_arc: "再做奖励与缓冲资金分配任务",
      delay_ladder: "用时间梯度任务探测即时偏好",
      plan_craft: "把当前模式转成具体下一步",
      counselor: "邀请顾问进入共同干预流程",
    },
    evidenceNotes: {
      cue_triage: "10 个低压力微选择",
      adaptive: "动态测试内容",
      budget_arc: "奖励/缓冲预算分配活动",
      delay_ladder: "延迟折扣偏好阶梯",
      plan_craft: "行动计划记录",
      message_regret: "对话中出现后悔或失控线索",
      message_guard: "对话中出现预算/等待等自控线索",
      url_signal: "分享了商品链接并提取页面上下文",
    },
    taskStatus: {
      pending: "待完成",
      completed: "已完成",
    },
    careReasons: {
      urgent: "风险持续偏高，应当由人工顾问复核并接入干预。",
      recommended: "风险或停滞迹象说明顾问可以帮助细化策略。",
      watch: "当前可继续进行系统感知与轻量干预，暂不需要顾问接管。",
      human: "顾问已经在环，可以直接调整策略与里程碑。",
    },
    suggestedMoves: {
      delay_rule: "设置 24 小时冷静规则，避免因降价立刻下单。",
      social_buffer: "在社交推荐购买前加入二次核验停顿。",
      mood_detour: "为夜间情绪性浏览预设非购物替代动作。",
      friction_stack: "把预算提醒和心愿单摩擦放到结账前。",
      counselor_join: "让顾问一起监测里程碑并调整干预策略。",
    },
    protectiveFactors: {
      buffer: "愿意保留预算缓冲",
      future: "能够把未来目标放在眼前",
      planning: "执行具体行动计划，而不是停留在泛化承诺",
      support: "愿意接受人类或同伴监督",
      reflection: "下单前愿意反思",
    },
    triggerLabels: {
      countdown: "时机窗口敏感",
      mood_relief: "恢复取向",
      social_proof: "社会线索敏感",
      instant_reward: "即时回报取向",
      recommendation: "新奇线索敏感",
    },
  },
};

const TASK_DEFINITIONS = {
  cue_triage: {
    estimatedMinutes: 5,
    theories: ["Cue-reactivity", "Affect regulation", "Social influence"],
    items: {
      q1: {
        options: {
          A: { cue_drive: 80, emotion_relief: 38, social_pull: 28, present_bias: 74, planning_strength: 28, help_readiness: 30, tag: "countdown" },
          B: { cue_drive: 36, emotion_relief: 28, social_pull: 26, present_bias: 34, planning_strength: 76, help_readiness: 36, tag: "reflection" },
          C: { cue_drive: 32, emotion_relief: 24, social_pull: 24, present_bias: 30, planning_strength: 82, help_readiness: 42, tag: "buffer" },
          D: { cue_drive: 44, emotion_relief: 28, social_pull: 58, present_bias: 38, planning_strength: 60, help_readiness: 60, tag: "social_proof" },
        },
      },
      q2: {
        options: {
          A: { cue_drive: 54, emotion_relief: 84, social_pull: 26, present_bias: 70, planning_strength: 26, help_readiness: 28, tag: "mood_relief" },
          B: { cue_drive: 28, emotion_relief: 34, social_pull: 20, present_bias: 28, planning_strength: 82, help_readiness: 40, tag: "reflection" },
          C: { cue_drive: 36, emotion_relief: 44, social_pull: 24, present_bias: 40, planning_strength: 74, help_readiness: 34, tag: "buffer" },
          D: { cue_drive: 68, emotion_relief: 64, social_pull: 30, present_bias: 58, planning_strength: 36, help_readiness: 26, tag: "recommendation" },
        },
      },
      q3: {
        options: {
          A: { cue_drive: 56, emotion_relief: 34, social_pull: 84, present_bias: 60, planning_strength: 28, help_readiness: 30, tag: "social_proof" },
          B: { cue_drive: 38, emotion_relief: 28, social_pull: 48, present_bias: 34, planning_strength: 72, help_readiness: 38, tag: "buffer" },
          C: { cue_drive: 34, emotion_relief: 26, social_pull: 36, present_bias: 30, planning_strength: 78, help_readiness: 36, tag: "reflection" },
          D: { cue_drive: 42, emotion_relief: 30, social_pull: 68, present_bias: 40, planning_strength: 62, help_readiness: 68, tag: "support" },
          E: { cue_drive: 46, emotion_relief: 34, social_pull: 58, present_bias: 46, planning_strength: 58, help_readiness: 42, tag: "social_proof" },
          F: { cue_drive: 30, emotion_relief: 26, social_pull: 30, present_bias: 26, planning_strength: 84, help_readiness: 34, tag: "planning" },
          G: { cue_drive: 60, emotion_relief: 40, social_pull: 72, present_bias: 62, planning_strength: 34, help_readiness: 30, tag: "recommendation" },
          H: { cue_drive: 34, emotion_relief: 28, social_pull: 44, present_bias: 32, planning_strength: 70, help_readiness: 64, tag: "support" },
        },
      },
      q4: {
        options: {
          A: { cue_drive: 62, emotion_relief: 40, social_pull: 28, present_bias: 78, planning_strength: 30, help_readiness: 26, tag: "instant_reward" },
          B: { cue_drive: 34, emotion_relief: 30, social_pull: 24, present_bias: 34, planning_strength: 78, help_readiness: 36, tag: "buffer" },
          C: { cue_drive: 46, emotion_relief: 36, social_pull: 34, present_bias: 48, planning_strength: 64, help_readiness: 38, tag: "planning" },
          D: { cue_drive: 52, emotion_relief: 54, social_pull: 32, present_bias: 60, planning_strength: 44, help_readiness: 32, tag: "mood_relief" },
        },
      },
      q5: {
        options: {
          A: { cue_drive: 76, emotion_relief: 38, social_pull: 34, present_bias: 72, planning_strength: 28, help_readiness: 28, tag: "recommendation" },
          B: { cue_drive: 40, emotion_relief: 28, social_pull: 28, present_bias: 36, planning_strength: 76, help_readiness: 36, tag: "reflection" },
          C: { cue_drive: 36, emotion_relief: 26, social_pull: 26, present_bias: 32, planning_strength: 82, help_readiness: 34, tag: "buffer" },
          D: { cue_drive: 52, emotion_relief: 30, social_pull: 72, present_bias: 46, planning_strength: 54, help_readiness: 58, tag: "social_proof" },
          E: { cue_drive: 76, emotion_relief: 34, social_pull: 36, present_bias: 72, planning_strength: 30, help_readiness: 28, tag: "countdown" },
          F: { cue_drive: 34, emotion_relief: 26, social_pull: 24, present_bias: 28, planning_strength: 86, help_readiness: 34, tag: "planning" },
          G: { cue_drive: 58, emotion_relief: 68, social_pull: 26, present_bias: 56, planning_strength: 40, help_readiness: 26, tag: "mood_relief" },
          H: { cue_drive: 44, emotion_relief: 30, social_pull: 60, present_bias: 40, planning_strength: 64, help_readiness: 62, tag: "support" },
        },
      },
      q6: {
        options: {
          A: { cue_drive: 70, emotion_relief: 42, social_pull: 30, present_bias: 76, planning_strength: 26, help_readiness: 28, tag: "instant_reward" },
          B: { cue_drive: 32, emotion_relief: 28, social_pull: 24, present_bias: 30, planning_strength: 82, help_readiness: 36, tag: "reflection" },
          C: { cue_drive: 42, emotion_relief: 32, social_pull: 28, present_bias: 42, planning_strength: 70, help_readiness: 34, tag: "buffer" },
          D: { cue_drive: 58, emotion_relief: 52, social_pull: 26, present_bias: 56, planning_strength: 42, help_readiness: 28, tag: "mood_relief" },
        },
      },
      q7: {
        options: {
          A: { cue_drive: 56, emotion_relief: 76, social_pull: 24, present_bias: 68, planning_strength: 30, help_readiness: 28, tag: "mood_relief" },
          B: { cue_drive: 34, emotion_relief: 34, social_pull: 20, present_bias: 34, planning_strength: 76, help_readiness: 34, tag: "planning" },
          C: { cue_drive: 38, emotion_relief: 38, social_pull: 22, present_bias: 38, planning_strength: 72, help_readiness: 36, tag: "buffer" },
          D: { cue_drive: 64, emotion_relief: 58, social_pull: 26, present_bias: 56, planning_strength: 42, help_readiness: 28, tag: "recommendation" },
        },
      },
      q8: {
        options: {
          A: { cue_drive: 66, emotion_relief: 34, social_pull: 30, present_bias: 70, planning_strength: 28, help_readiness: 26, tag: "instant_reward" },
          B: { cue_drive: 34, emotion_relief: 26, social_pull: 24, present_bias: 30, planning_strength: 84, help_readiness: 34, tag: "reflection" },
          C: { cue_drive: 42, emotion_relief: 30, social_pull: 28, present_bias: 40, planning_strength: 72, help_readiness: 36, tag: "buffer" },
          D: { cue_drive: 48, emotion_relief: 30, social_pull: 64, present_bias: 44, planning_strength: 58, help_readiness: 62, tag: "support" },
          E: { cue_drive: 70, emotion_relief: 34, social_pull: 30, present_bias: 70, planning_strength: 30, help_readiness: 24, tag: "instant_reward" },
          F: { cue_drive: 32, emotion_relief: 26, social_pull: 24, present_bias: 28, planning_strength: 86, help_readiness: 34, tag: "planning" },
          G: { cue_drive: 44, emotion_relief: 56, social_pull: 24, present_bias: 48, planning_strength: 54, help_readiness: 28, tag: "mood_relief" },
          H: { cue_drive: 52, emotion_relief: 30, social_pull: 70, present_bias: 46, planning_strength: 50, help_readiness: 48, tag: "social_proof" },
        },
      },
      q9: {
        options: {
          A: { cue_drive: 78, emotion_relief: 36, social_pull: 28, present_bias: 74, planning_strength: 28, help_readiness: 26, tag: "countdown" },
          B: { cue_drive: 36, emotion_relief: 28, social_pull: 24, present_bias: 34, planning_strength: 78, help_readiness: 34, tag: "reflection" },
          C: { cue_drive: 34, emotion_relief: 26, social_pull: 22, present_bias: 30, planning_strength: 84, help_readiness: 36, tag: "buffer" },
          D: { cue_drive: 58, emotion_relief: 46, social_pull: 28, present_bias: 58, planning_strength: 42, help_readiness: 28, tag: "mood_relief" },
        },
      },
      q10: {
        options: {
          A: { cue_drive: 56, emotion_relief: 72, social_pull: 26, present_bias: 70, planning_strength: 34, help_readiness: 28, tag: "mood_relief" },
          B: { cue_drive: 34, emotion_relief: 32, social_pull: 22, present_bias: 32, planning_strength: 78, help_readiness: 36, tag: "planning" },
          C: { cue_drive: 38, emotion_relief: 34, social_pull: 24, present_bias: 34, planning_strength: 80, help_readiness: 36, tag: "buffer" },
          D: { cue_drive: 46, emotion_relief: 32, social_pull: 68, present_bias: 42, planning_strength: 60, help_readiness: 66, tag: "support" },
          E: { cue_drive: 58, emotion_relief: 72, social_pull: 30, present_bias: 66, planning_strength: 36, help_readiness: 28, tag: "mood_relief" },
          F: { cue_drive: 32, emotion_relief: 28, social_pull: 26, present_bias: 28, planning_strength: 84, help_readiness: 36, tag: "planning" },
          G: { cue_drive: 68, emotion_relief: 38, social_pull: 34, present_bias: 72, planning_strength: 32, help_readiness: 26, tag: "instant_reward" },
          H: { cue_drive: 42, emotion_relief: 34, social_pull: 56, present_bias: 38, planning_strength: 64, help_readiness: 62, tag: "support" },
        },
      },
    },
  },
  budget_arc: {
    estimatedMinutes: 3,
    theories: ["Mental accounting", "Behavioral self-control"],
  },
  delay_ladder: {
    estimatedMinutes: 3,
    theories: ["Delay discounting", "Self-regulation"],
  },
  plan_craft: {
    estimatedMinutes: 5,
    theories: ["Implementation intentions", "Stepped care", "Motivational support"],
  },
};

const TASK_COPY = {
  en: {
    cue_triage: {
      title: "Life Preference Portrait",
      description:
        "Choose the option that feels most like you in ten everyday situations. There are no right answers.",
      theory:
        "Maps ordinary preferences to latent self-regulation, reward sensitivity, affect regulation, social orientation, and planning constructs.",
      items: {
        q1: {
          prompt: "It is your birthday. Which celebration feels most natural?",
          options: {
            A: "A lively gathering with many relatives and friends.",
            B: "A warm dinner with a few close people.",
            C: "A quiet day alone, such as a film, a walk, or a short trip.",
            D: "Let it pass naturally, almost like any other day.",
          },
        },
        q2: {
          prompt: "You suddenly receive a free afternoon with no fixed obligations. What do you do first?",
          options: {
            A: "Find something fresh or exciting to make the day feel different.",
            B: "Rest, recover, and avoid adding more stimulation.",
            C: "Use the time for something you have been meaning to organize.",
            D: "Ask someone nearby whether they want to do something together.",
          },
        },
        q3: {
          prompt: "Your friends are organizing a day trip for next Saturday, but the details are not final yet. What is most like your first response?",
          options: {
            A: "Agree right away—the larger the group, the more enjoyable it will be.",
            B: "Wait until the plan is clearer before deciding.",
            C: "Check the travel time and the rest of your week first.",
            D: "Ask a close friend whether they are going.",
            E: "Join if the group still has space for one more person.",
            F: "Add it to your calendar, then decide after checking your plans.",
            G: "Say yes because it already sounds popular and fun.",
            H: "Ask the organizer a few questions before deciding together.",
          },
        },
        q4: {
          prompt: "You are choosing a seat for a long train ride. Which one would you pick?",
          options: {
            A: "A seat near the liveliest area, so the trip feels less dull.",
            B: "A quiet corner where you can withdraw if needed.",
            C: "A practical seat with easy access and enough space.",
            D: "A seat near the people you are traveling with.",
          },
        },
        q5: {
          prompt: "An optional evening class opens for registration. Which piece of information would draw your attention first?",
          options: {
            A: "A short hands-on session you can join immediately.",
            B: "A brief overview explaining what the class involves.",
            C: "A course outline with clear weekly milestones.",
            D: "Comments from people who have already taken the class.",
            E: "A notice that the first session has only a few places left.",
            F: "A timetable you can compare with your weekly routine.",
            G: "Information about a quiet place to pause between activities.",
            H: "Whether a friend could take the class with you.",
          },
        },
        q6: {
          prompt: "You are packing for a two-day trip. Your bag usually ends up as:",
          options: {
            A: "Full of extra possibilities, just in case the mood changes.",
            B: "Very light, because too many things feel like a burden.",
            C: "Checked against a list with only what is needed.",
            D: "Adjusted after asking someone experienced what they would bring.",
          },
        },
        q7: {
          prompt: "A small plan fails at the last minute. What is your first reaction?",
          options: {
            A: "Quickly choose a substitute so the day still has a highlight.",
            B: "Step back and let the disappointment settle first.",
            C: "Rebuild the plan around the original goal.",
            D: "Message someone and decide together.",
          },
        },
        q8: {
          prompt: "You arrive at a community festival in an unfamiliar neighborhood. Which clue would you notice first?",
          options: {
            A: "A brightly lit stall with a fast-moving crowd.",
            B: "A quiet booth with a logo you already know.",
            C: "A board showing the schedule, walking time, and queue length.",
            D: "A recommendation note from someone who knows the area.",
            E: "A sign saying a performance starts in five minutes.",
            F: "A simple map with a suggested route.",
            G: "A quiet corner with room to pause.",
            H: "A table where groups are already chatting and sharing food.",
          },
        },
        q9: {
          prompt: "You receive a message saying a limited spot opened for an event you considered before.",
          options: {
            A: "Take the spot before it disappears.",
            B: "Let it pass unless you already planned for it.",
            C: "Check whether it fits your week before responding.",
            D: "Ask someone whether they would join or recommend it.",
          },
        },
        q10: {
          prompt: "After a demanding week, you have an unplanned evening. What feels most restorative?",
          options: {
            A: "Choose something lively that changes your mood straight away.",
            B: "Make the room quiet and leave the evening open.",
            C: "Tidy a few loose ends so next week starts clearly.",
            D: "Spend the evening with someone who knows you well.",
            E: "Slow down with a warm drink and no demands.",
            F: "Set one small rule for the evening and follow it.",
            G: "Find a last-minute activity that gives the week a strong finish.",
            H: "Message someone you trust and see whether they can talk.",
          },
        },
      },
    },
    budget_arc: {
      title: "Budget Arc",
      description:
        "Split 100 tokens across five jars. The allocation indirectly reveals where spending energy flows under pressure.",
      theory:
        "Adapts mental-accounting logic to compare immediate reward, social spending, and future buffering.",
      jars: {
        immediate: "Immediate thrill",
        social: "Social moments",
        comfort: "Comfort mood",
        buffer: "Safety buffer",
        future: "Future goal",
      },
      hint: "The five jars must sum to 100.",
    },
    delay_ladder: {
      title: "Horizon Ladder",
      description:
        "Pick across five trade-offs between a smaller immediate reward and a larger delayed benefit.",
      theory:
        "Uses delay-discounting structure to estimate present bias without asking directly whether you are impulsive.",
      items: [
        { key: "q1", now: "Get a small treat tonight", later: "Keep the budget for a weekend plan" },
        { key: "q2", now: "Use a flash-sale coupon today", later: "Wait for a scheduled purchase next week" },
        { key: "q3", now: "Upgrade to the nicer option now", later: "Protect savings for next month's target" },
        { key: "q4", now: "Buy because the streamer recommends it", later: "Keep the money until you compare offline" },
        { key: "q5", now: "Add one more item at checkout", later: "Leave room for a milestone reward later" },
      ],
    },
    plan_craft: {
      title: "Next-Step Plan",
      description:
        "The detected pattern becomes a concrete intervention plan with checkpoints and escalation rules.",
      theory:
        "Grounded in implementation intentions and stepped-care escalation; the plan is shaped from the detected profile.",
      goals: {
        curb_live: "Reduce live-commerce impulse buys",
        curb_night: "Reduce late-night mood shopping",
        curb_social: "Reduce socially triggered purchases",
        protect_goal: "Protect a savings or study goal",
      },
      triggers: {
        timer: "When I see a countdown or stock warning",
        mood: "When I browse to feel better after stress",
        groupchat: "When a creator / group chat makes something feel urgent",
        payday: "When payday makes spending feel easier",
      },
      actions: {
        wait: "I will wait 24 hours and reopen the item later",
        list: "I will move it into a wish-list and compare alternatives",
        budget: "I will check my monthly buffer before any checkout",
        replace: "I will do a non-shopping reset first",
      },
      supports: {
        ai_only: "Use system reminders first",
        counselor: "Let the counselor join if progress stalls",
        friend: "Ask a friend / partner to be the first checkpoint",
      },
      horizon: {
        30: "1 month",
        60: "2 months",
      },
      milestoneLabels: [
        "Milestone 1",
        "Milestone 2",
        "Milestone 3",
      ],
    },
  },
  zh: {
    cue_triage: {
      title: "生活偏好画像",
      description:
        "在 10 个日常情境里选择最像你的选项。没有标准答案。",
      theory:
        "把普通生活偏好映射到自我调节、奖赏敏感、情绪调节、社会取向和计划性等潜在构念。",
      items: {
        q1: {
          prompt: "今天是你的生日，你更倾向于选择什么样的庆祝方式？",
          options: {
            A: "大摆宴席，邀请大批亲人朋友欢聚一堂。",
            B: "约三两知己或家人温馨小聚。",
            C: "独自一人静静度过，比如看电影、旅行或放空。",
            D: "顺其自然，当作平常日子一样过去。",
          },
        },
        q2: {
          prompt: "突然多出一个没有安排的下午，你第一反应更接近哪一种？",
          options: {
            A: "找一件新鲜或有趣的事，让这天变得不一样。",
            B: "先休息恢复，尽量减少额外刺激。",
            C: "用来整理一件早就想处理的小事。",
            D: "问问身边的人要不要一起做点什么。",
          },
        },
        q3: {
          prompt: "朋友们正在组织下周六的一日游，但细节还没最后确定。你最初的反应更接近哪一种？",
          options: {
            A: "立刻答应——人越多应该越好玩。",
            B: "等计划更明确后再决定。",
            C: "先看看路程和这一周其余安排。",
            D: "问一个亲近的朋友他或她会不会去。",
            E: "如果队伍还差一个人，就加入。",
            F: "先记进日历，查完安排再决定。",
            G: "因为听起来很热门、很好玩，就先答应。",
            H: "先问组织者几个问题，再一起决定。",
          },
        },
        q4: {
          prompt: "如果要坐一趟较长的火车，你更偏向选择哪种座位？",
          options: {
            A: "靠近热闹区域，路上不容易无聊。",
            B: "安静角落，方便自己抽离休息。",
            C: "位置实用，出入方便且空间合适。",
            D: "尽量靠近同行的人，方便照应。",
          },
        },
        q5: {
          prompt: "一门可选的晚间课程开放报名时，哪条信息最先吸引你？",
          options: {
            A: "可以立即参加的短体验课。",
            B: "简要说明课程内容的介绍。",
            C: "列出每周目标的课程安排。",
            D: "已经上过课的学员评论。",
            E: "首节课只剩少量名额的提示。",
            F: "可与每周日程对照的上课时间表。",
            G: "课间可安静休息的空间信息。",
            H: "朋友能否一起报名。",
          },
        },
        q6: {
          prompt: "准备两天一夜的短途行李时，你的包通常会变成哪种状态？",
          options: {
            A: "多带几种可能用得上的东西，以防心情或情况变化。",
            B: "尽量轻便，东西太多会让人有负担。",
            C: "对着清单检查，只带真正需要的。",
            D: "会问有经验的人，让对方帮忙判断。",
          },
        },
        q7: {
          prompt: "一个小计划临时失败，你的第一反应通常是：",
          options: {
            A: "马上找个替代方案，让今天仍然有亮点。",
            B: "先退一步，让失落感自己过去。",
            C: "围绕原本目标重新安排。",
            D: "找人商量，再一起决定怎么改。",
          },
        },
        q8: {
          prompt: "来到一个陌生社区的市集时，哪条线索会先吸引你的注意？",
          options: {
            A: "灯光明亮、队伍移动很快的摊位。",
            B: "挂着熟悉标志的安静摊位。",
            C: "写着活动时间、步行距离和排队时长的看板。",
            D: "熟悉这里的人留下的推荐便签。",
            E: "写着五分钟后开始表演的提示牌。",
            F: "标出推荐路线的简单地图。",
            G: "有空间可以稍作休息的安静角落。",
            H: "已经有人聊天、分享食物的一桌人。",
          },
        },
        q9: {
          prompt: "有人告诉你，之前考虑过的一个活动突然空出最后一个名额。",
          options: {
            A: "先把名额拿下，免得错过。",
            B: "如果原本没安排，就让它过去。",
            C: "先看它是否适合这一周的安排。",
            D: "问问有没有人同行或推荐。",
          },
        },
        q10: {
          prompt: "忙碌的一周结束后，突然空出一个晚上。哪种方式最能让你恢复？",
          options: {
            A: "选择一件能立刻改变心情、很有活力的事。",
            B: "把房间安静下来，什么都不安排。",
            C: "收尾几件小事，让下周开始得更清楚。",
            D: "和真正了解你的人一起度过晚上。",
            E: "喝杯热饮，慢下来，不给自己任何要求。",
            F: "给这个晚上定一条小规则，并照着做。",
            G: "临时找个活动，为这一周画上有力的句号。",
            H: "给信任的人发消息，看看能不能聊一会儿。",
          },
        },
      },
    },
    budget_arc: {
      title: "预算弧线",
      description:
        "把 100 个代币分给 5 个预算罐。这个分配会间接暴露你在压力下把注意力放在哪里。",
      theory:
        "借助心理账户逻辑，对比即时奖励、社交消费和未来缓冲的权重。",
      jars: {
        immediate: "即时快感",
        social: "社交场合",
        comfort: "情绪安慰",
        buffer: "安全缓冲",
        future: "未来目标",
      },
      hint: "5 个预算罐加起来必须等于 100。",
    },
    delay_ladder: {
      title: "时间阶梯",
      description:
        "在 5 组“较小立即回报”和“较大延迟收益”之间做选择。",
      theory:
        "用延迟折扣结构估计即时偏好，而不是直接问你是否冲动。",
      items: [
        { key: "q1", now: "今晚立刻给自己一个小奖励", later: "把预算留给周末计划" },
        { key: "q2", now: "今天就用掉限时券", later: "等到下周的计划性购买" },
        { key: "q3", now: "现在就升级到更高配", later: "把钱留给下个月目标" },
        { key: "q4", now: "因为直播推荐就先买", later: "离线比较后再决定" },
        { key: "q5", now: "结账时再多加一件", later: "把空间留给之后的里程碑奖励" },
      ],
    },
    plan_craft: {
      title: "下一步行动计划",
      description:
        "根据当前画像形成一套明确行动计划，包括检查点与升级规则。",
      theory:
        "基于实施意图与分级人工介入框架；方案由当前画像信号决定。",
      goals: {
        curb_live: "减少直播或闪促冲动消费",
        curb_night: "减少夜间情绪性购物",
        curb_social: "减少社交触发型消费",
        protect_goal: "保护储蓄/学习目标",
      },
      triggers: {
        timer: "当我看到倒计时或库存告急时",
        mood: "当我因为压力想靠浏览购物缓解情绪时",
        groupchat: "当群聊/博主让商品显得很急时",
        payday: "当发薪日让我觉得花钱更轻松时",
      },
      actions: {
        wait: "我会先等 24 小时，再回来看",
        list: "我会放进心愿单并比较替代品",
        budget: "我会先检查本月缓冲预算",
        replace: "我会先做一个非购物的情绪重置动作",
      },
      supports: {
        ai_only: "先使用系统观察和提醒",
        counselor: "如果进展停滞，就让顾问介入",
        friend: "先让朋友/伴侣做第一道检查点",
      },
      horizon: {
        30: "1 个月",
        60: "2 个月",
      },
      milestoneLabels: [
        "里程碑 1",
        "里程碑 2",
        "里程碑 3",
      ],
    },
  },
};

const MESSAGE_HINTS = {
  regret: ["regret", "ashamed", "couldn't stop", "overbought", "guilty", "late-night", "后悔", "停不下来", "买多了", "冲动", "内疚", "半夜"],
  guard: ["budget", "wait", "compare", "wishlist", "record", "缓冲", "预算", "等等", "比较", "心愿单", "记录"],
  help: ["help", "counselor", "advisor", "complain", "frustrated", "support", "顾问", "老师", "帮我", "介入", "烦", "崩"],
};

const ADAPTIVE_MODES = ["symbol", "route"];

const ADAPTIVE_MODE_COPY = {
  en: {
    symbol: {
      title: "Symbol Drift",
      description:
        "This oblique association test was generated from the first profile pass. Pick by feel; the options are intentionally indirect.",
      theory:
        "Uses projective micro-associations to separate cue pull, reward timing, mood repair, social echo, planning structure, and support openness.",
    },
    route: {
      title: "Route Sampler",
      description:
        "This second probe was generated from the first response pattern. It asks about routes, textures, and defaults rather than spending labels.",
      theory:
        "Uses low-stakes path choices to test whether the first-pass pattern holds under different framing.",
    },
    plan: {
      title: "Adaptive Next-Step Plan",
      description:
        "The earlier profile signals are translated into a concrete next-step plan.",
      theory:
        "Turns the inferred pattern into an implementation intention without asking the participant to choose a treatment.",
      milestoneLabels: ["First checkpoint", "Middle adjustment", "Visible marker"],
    },
    generatedReason:
      "Generated from the first profile pass; content changes when the leading signals change.",
  },
  zh: {
    symbol: {
      title: "隐喻漂移测试",
      description:
        "系统根据首轮画像生成了这组更隐晦的联想测试。按直觉选即可，选项有意不直接指向消费。",
      theory:
        "用投射式微联想区分线索拉力、奖励时机、情绪修复、社交回声、计划结构和求助开放度。",
    },
    route: {
      title: "路径取样测试",
      description:
        "系统根据首轮反应模式生成了第二组探测题。它问的是路线、质感和默认动作，而不是消费标签。",
      theory:
        "用低压力路径选择测试首轮画像在不同表达方式下是否稳定。",
    },
    plan: {
      title: "动态行动计划",
      description:
        "根据前面画像信号生成一条具体行动路径。",
      theory:
        "把推断出的行为模式转成可执行的实施意图，而不是让参与者自行选择治疗方案。",
      milestoneLabels: ["第一个检查点", "中段调整", "可见标记"],
    },
    generatedReason:
      "由首轮画像动态生成；主导信号变化时，后续测试内容也会变化。",
  },
};

const ADAPTIVE_ARCHETYPES = {
  en: {
    symbol: [
      ["A", "A folded old map", "planning_strength", "buffer"],
      ["B", "A warm lamp on a rainy night", "emotion_relief", "mood_relief"],
      ["C", "A neon vending machine", "cue_drive", "countdown"],
      ["D", "A chorus hook everyone knows", "social_pull", "social_proof"],
      ["E", "A red unread dot", "cue_drive", "recommendation"],
      ["F", "A clear storage box", "planning_strength", "planning"],
      ["G", "A can that opens with a snap", "present_bias", "instant_reward"],
      ["H", "Shared headphones on a train", "help_readiness", "support"],
    ],
    route: [
      ["A", "The bright entrance with moving lights", "cue_drive", "countdown"],
      ["B", "The quiet side door with a timetable", "planning_strength", "planning"],
      ["C", "The table where everyone is already laughing", "social_pull", "social_proof"],
      ["D", "The soft chair near the window", "emotion_relief", "mood_relief"],
      ["E", "The one-click shortcut", "present_bias", "instant_reward"],
      ["F", "The note you can forward to someone", "help_readiness", "support"],
      ["G", "The shelf with labels facing outward", "planning_strength", "buffer"],
      ["H", "The aisle with a limited sign", "cue_drive", "recommendation"],
    ],
  },
  zh: {
    symbol: [
      ["A", "折角旧地图", "planning_strength", "buffer"],
      ["B", "雨夜暖灯", "emotion_relief", "mood_relief"],
      ["C", "霓虹售货机", "cue_drive", "countdown"],
      ["D", "人人都会哼的副歌", "social_pull", "social_proof"],
      ["E", "未读红点", "cue_drive", "recommendation"],
      ["F", "透明收纳盒", "planning_strength", "planning"],
      ["G", "啪嗒一声打开的汽水罐", "present_bias", "instant_reward"],
      ["H", "列车上的双人耳机", "help_readiness", "support"],
    ],
    route: [
      ["A", "灯光会动的入口", "cue_drive", "countdown"],
      ["B", "贴着时刻表的侧门", "planning_strength", "planning"],
      ["C", "大家已经笑起来的那桌", "social_pull", "social_proof"],
      ["D", "靠窗的软椅", "emotion_relief", "mood_relief"],
      ["E", "一步到达的捷径", "present_bias", "instant_reward"],
      ["F", "可以转发给别人的便签", "help_readiness", "support"],
      ["G", "标签朝外的整齐货架", "planning_strength", "buffer"],
      ["H", "写着限时的走廊", "cue_drive", "recommendation"],
    ],
  },
};

const ADAPTIVE_PROMPTS = {
  en: {
    symbol: [
      "If the next hour had to be represented by one object, which one sits closest?",
      "If a small decision had background music, which texture would it borrow?",
      "If your phone home screen grew one extra doorway tonight, what would it look like?",
      "If a weekend plan had a mascot, which one would walk in first?",
      "If a tiny temptation wore a disguise, which disguise would be most believable?",
    ],
    route: [
      "You enter a place with no labels. Which route do you naturally inspect first?",
      "A plan becomes noisy. Which anchor would you use without explaining it to anyone?",
      "A small reward is waiting somewhere in the room. Which clue would you follow?",
      "You need to pause for ten seconds. Which surface makes that easiest?",
      "A choice has to be parked for later. Where would you leave it?",
    ],
  },
  zh: {
    symbol: [
      "如果接下来一小时只能被一个物件代表，哪一个更贴近？",
      "如果一个小决定有背景音，它会借用哪种质感？",
      "如果今晚手机首页多出一扇门，它更像什么？",
      "如果周末计划有一个先走进来的吉祥物，它会是什么？",
      "如果一个微小诱因戴着伪装，哪种伪装最可信？",
    ],
    route: [
      "你走进一个没有标签的地方，会先自然查看哪条路？",
      "一个计划开始变吵，你会用哪个锚点稳住它？",
      "房间里某处藏着一个小奖励，你会跟随哪个线索？",
      "你需要停十秒钟，哪种表面最容易让你停下来？",
      "一个选择需要先停放到之后，你会把它放在哪里？",
    ],
  },
};

const ADAPTIVE_PLAN_COPY = {
  en: {
    goals: {
      cue_drive: "Lower the pull of bright cues",
      emotion_relief: "Separate mood repair from quick acquisition",
      social_pull: "Slow down social echo decisions",
      present_bias: "Add distance before immediate rewards",
      planning_strength: "Keep the plan light enough to use",
      help_readiness: "Use support without over-escalating",
    },
    triggers: {
      cue_drive: "When a signal feels unusually available",
      emotion_relief: "When the day needs a quick emotional lift",
      social_pull: "When a group makes the option feel alive",
      present_bias: "When the near reward feels easier than the later one",
      planning_strength: "When planning itself becomes friction",
      help_readiness: "When another person's view could change the decision",
    },
    actions: {
      cue_drive: "I will remove the cue and revisit from a plain list",
      emotion_relief: "I will do one non-purchase mood reset first",
      social_pull: "I will wait until the group energy fades",
      present_bias: "I will add a timed delay before any irreversible step",
      planning_strength: "I will use one short rule instead of a complex plan",
      help_readiness: "I will send a neutral checkpoint message first",
    },
  },
  zh: {
    goals: {
      cue_drive: "降低强提示带来的牵引",
      emotion_relief: "把情绪修复和即时获得拆开",
      social_pull: "放慢社交回声里的决定",
      present_bias: "在近处奖励前增加一点距离",
      planning_strength: "让计划轻到真的能用",
      help_readiness: "使用支持，但不过度升级",
    },
    triggers: {
      cue_drive: "当某个信号显得特别容易抓住时",
      emotion_relief: "当这一天需要快速情绪提振时",
      social_pull: "当群体气氛让选项变得鲜活时",
      present_bias: "当近处奖励明显比之后的收益更省力时",
      planning_strength: "当计划本身开始变成阻力时",
      help_readiness: "当别人的看法可能改变决定时",
    },
    actions: {
      cue_drive: "我会移开提示，从朴素清单里重新看",
      emotion_relief: "我会先做一个非购买的情绪重置",
      social_pull: "我会等群体热度退掉后再看",
      present_bias: "我会在不可逆动作前加入计时延迟",
      planning_strength: "我会用一条短规则替代复杂计划",
      help_readiness: "我会先发一条中性检查消息",
    },
  },
};

export class TaskInputError extends Error {
  constructor(message) {
    super(message);
    this.name = "TaskInputError";
    this.status = 400;
  }
}

export function normalizeLanguage(value) {
  return SUPPORTED_LANGUAGES.has(String(value || "").trim()) ? String(value).trim() : "en";
}

export function getResearchCopy(language) {
  return UI_COPY[normalizeLanguage(language)];
}

export function getTaskCatalog(language, options = {}) {
  const lang = normalizeLanguage(language);
  const taskCopy = TASK_COPY[lang];
  const baseTask = buildCueTask(taskCopy.cue_triage);
  return [baseTask];
}

export function scoreTaskSubmission(taskKey, payload, language) {
  const lang = normalizeLanguage(language);
  try {
    if (taskKey === "cue_triage") return scoreCueTask(payload, lang);
    if (isAdaptiveMicroTaskKey(taskKey)) return scoreAdaptiveMicroTask(taskKey, payload, lang);
    if (isAdaptivePlanTaskKey(taskKey)) return scoreAdaptivePlanTask(taskKey, payload, lang);
    if (taskKey === "budget_arc") return scoreBudgetTask(payload, lang);
    if (taskKey === "delay_ladder") return scoreDelayTask(payload, lang);
    if (taskKey === "plan_craft") return scorePlanTask(payload, lang);
    throw new TaskInputError(lang === "zh" ? "未知测试任务。" : "Unknown task.");
  } catch (error) {
    if (error instanceof TaskInputError) throw error;
    if (isProgrammingError(error)) throw error;
    throw new TaskInputError(String(error?.message || (lang === "zh" ? "测试提交无效。" : "Invalid task submission.")));
  }
}

export function summarizeTaskEvent(event, language) {
  const lang = normalizeLanguage(language);
  const copy = getResearchCopy(lang);
  const score = parseJson(event.score_json, {});
  const task = getTaskCatalog(lang).find((item) => item.key === event.task_key) || buildAdaptiveTaskFromKey(event.task_key, lang);
  return {
    key: event.task_key,
    title: task?.title || event.task_key,
    summary: score.summary || copy.taskStatus.completed,
    createdAt: event.created_at,
    metrics: score.metrics || {},
    tags: score.tags || [],
  };
}

export function buildProfile({ events, messages, careCase, snapshots, language }) {
  const lang = normalizeLanguage(language);
  const copy = getResearchCopy(lang);
  const latestEvents = latestEventMap(events);
  const eventScores = Object.values(latestEvents).map((event) => parseJson(event.score_json, {}));
  const metrics = {};
  for (const key of METRIC_KEYS) {
    const values = eventScores
      .map((item) => Number(item.metrics?.[key]))
      .filter((value) => Number.isFinite(value));
    metrics[key] = values.length ? clamp(average(values), 0, 100) : null;
  }

  const messageSignals = inspectMessages(messages);
  if (metrics.cue_drive !== null) metrics.cue_drive = clamp(metrics.cue_drive + messageSignals.cueBoost, 0, 100);
  if (metrics.emotion_relief !== null) metrics.emotion_relief = clamp(metrics.emotion_relief + messageSignals.emotionBoost, 0, 100);
  if (metrics.present_bias !== null) metrics.present_bias = clamp(metrics.present_bias + messageSignals.presentBoost, 0, 100);
  if (metrics.planning_strength !== null) metrics.planning_strength = clamp(metrics.planning_strength + messageSignals.guardBoost, 0, 100);
  if (metrics.help_readiness !== null) metrics.help_readiness = clamp(metrics.help_readiness + messageSignals.helpBoost, 0, 100);

  const completedTaskCount = Object.keys(latestEvents).length;
  const plan = extractPlanFromLatestEvents(latestEvents);
  if (plan && metrics.planning_strength !== null) metrics.planning_strength = clamp(metrics.planning_strength + 8, 0, 100);
  if (plan && metrics.help_readiness !== null && plan.support === "counselor") {
    metrics.help_readiness = clamp(metrics.help_readiness + 10, 0, 100);
  }

  const riskScore = completedTaskCount
    ? clamp(
        weightedRisk(metrics),
        0,
        100,
      )
    : null;

  const previousRisk = mostRecentRisk(snapshots);
  const risingRisk = previousRisk !== null && riskScore !== null && riskScore - previousRisk >= 8;
  const stage = determineStage({ completedTaskCount, plan, riskScore, previousRisk });
  const triggers = buildTriggers(latestEvents, metrics, copy);
  const protectiveFactors = buildProtectiveFactors(metrics, plan, copy);
  const suggestedMoves = buildSuggestedMoves(metrics, plan, copy);
  const evidence = buildEvidence(latestEvents, messageSignals, copy);
  const riskBand = riskBandText(riskScore, copy);
  const summary = buildSummary({
    copy,
    completedTaskCount,
    plan,
    riskBand,
    riskScore,
    stage,
    triggers,
    protectiveFactors,
  });

  return {
    protocolId: copy.protocolId,
    protocolName: copy.protocolName,
    theoryLine: copy.theoryLine,
    summary,
    risk_score: riskScore,
    risk_band: riskBand,
    stage,
    completed_task_count: completedTaskCount,
    tasks_completed: Object.keys(latestEvents),
    metrics,
    triggers,
    protective_factors: protectiveFactors,
    suggested_moves: suggestedMoves,
    evidence,
    plan,
    flags: [
      risingRisk ? "rising_risk" : null,
      riskScore !== null && riskScore >= 75 ? "high_risk" : null,
      plan ? "has_plan" : null,
      careCase?.status === "active" ? "human_active" : null,
    ].filter(Boolean),
  };
}

export function deriveCareCase({ profile, careCase, manualHelpRequested, snapshots, language }) {
  const lang = normalizeLanguage(language);
  const copy = getResearchCopy(lang);
  const existing = normalizeCareCase(careCase);
  const previousRisk = mostRecentRisk(snapshots);
  const risingRisk =
    previousRisk !== null &&
    profile.risk_score !== null &&
    profile.risk_score - previousRisk >= 8;

  let status = existing.status;
  let escalationLevel = existing.escalation_level;
  let aiReason = existing.ai_reason;

  if (manualHelpRequested) {
    status = "active";
    escalationLevel = "human";
    aiReason = copy.careReasons.human;
  } else if (existing.escalation_level === "human" || existing.status === "active") {
    status = "active";
    escalationLevel = "human";
    aiReason = copy.careReasons.human;
  } else if (profile.risk_score !== null && profile.risk_score >= 78) {
    status = "suggested";
    escalationLevel = "urgent";
    aiReason = copy.careReasons.urgent;
  } else if (
    (profile.risk_score !== null && profile.risk_score >= 62) ||
    risingRisk ||
    (profile.plan && profile.metrics.planning_strength !== null && profile.metrics.planning_strength < 45)
  ) {
    status = "suggested";
    escalationLevel = "recommended";
    aiReason = copy.careReasons.recommended;
  } else if (existing.status === "resolved") {
    status = "resolved";
    escalationLevel = "none";
    aiReason = copy.careReasons.watch;
  } else {
    status = "watch";
    escalationLevel = "none";
    aiReason = copy.careReasons.watch;
  }

  return {
    status,
    escalation_level: escalationLevel,
    ai_reason: aiReason,
    counselor_strategy: existing.counselor_strategy,
    plan_json: JSON.stringify(profile.plan || existing.plan || {}),
    last_human_message_at: existing.last_human_message_at || null,
  };
}

export function buildVisualizationBundle({ profile, snapshots, careCase, language }) {
  const lang = normalizeLanguage(language);
  const copy = getResearchCopy(lang);
  const plan = normalizePlan(profile.plan);
  const bloom = METRIC_KEYS.map((key) => ({
    key,
    label: copy.metrics[key],
    value: profile.metrics[key] ?? 0,
  }));
  const path = [...(snapshots || [])]
    .slice(-8)
    .map((item, index) => ({
      index,
      label: shortDate(item.created_at),
      risk: item.risk_score ?? 0,
      stage: item.stage,
      metrics: parseJson(item.metrics_json, {}),
    }));
  const milestones = (plan?.steps || []).map((step, index) => ({
    index,
    label: step,
    status: index === 0 ? "current" : "planned",
  }));

  return {
    titles: {
      bloom: copy.labels.bloomTitle,
      path: copy.labels.pathTitle,
      milestones: copy.labels.milestoneTitle,
    },
    bloom,
    path,
    milestones,
    care: {
      status: careCase?.status || "watch",
      escalation: careCase?.escalation_level || "none",
      reason: careCase?.ai_reason || copy.careReasons.watch,
    },
  };
}

export function buildTaskProgress(events, language) {
  const lang = normalizeLanguage(language);
  return buildTaskProgressForCatalog(getTaskCatalog(lang, { events }), events, lang);
}

export function buildTaskProgressForCatalog(tasks, events, language) {
  const lang = normalizeLanguage(language);
  const taskMap = latestEventMap(events);
  return (tasks || []).map((task) => {
    const event = taskMap[task.key];
    const score = event ? parseJson(event.score_json, {}) : null;
    return {
      key: task.key,
      title: task.title,
      status: event ? "completed" : "pending",
      statusLabel: getResearchCopy(lang).taskStatus[event ? "completed" : "pending"],
      summary: score?.summary || task.description,
      updatedAt: event?.created_at || null,
    };
  });
}

export function scoreGeneratedMicroTask(task, payload, language) {
  const lang = normalizeLanguage(language);
  if (!task || task.kind !== "micro_choices" || !Array.isArray(task.items)) {
    throw new TaskInputError(lang === "zh" ? "动态测试题目无效。" : "Invalid generated task.");
  }

  const metrics = emptyMetricMap(0);
  const tags = new Set();
  const selections = {};
  for (const item of task.items) {
    const value = String(payload?.[item.key] || "");
    if (item.type === "fill_blank") {
      const answer = value.replace(/\s+/g, " ").trim().slice(0, 500);
      if (!answer) {
        throw new TaskInputError(lang === "zh" ? "请完成这道动态填空。" : "Please complete this generated fill-in item.");
      }
      selections[item.key] = answer;
      for (const key of METRIC_KEYS) {
        metrics[key] += Number(item.metrics?.[key] ?? 50);
      }
      if (item.tag) tags.add(item.tag);
      continue;
    }

    const option = (item.options || []).find((entry) => entry.key === value);
    if (!option) {
      throw new TaskInputError(lang === "zh" ? "请完成这道动态选择。" : "Please complete this generated choice.");
    }
    selections[item.key] = value;
    for (const key of METRIC_KEYS) {
      metrics[key] += Number(option.metrics?.[key] || 0);
    }
    if (option.tag) tags.add(option.tag);
  }

  const normalizedMetrics = normalizeAverages(metrics, task.items.length);
  const strongest = strongestMetric(normalizedMetrics, getResearchCopy(lang));
  const taskTitle = localizeGeneratedTaskTitle(task, lang);
  return {
    taskKey: task.key,
    payload: {
      answers: selections,
      responseLanguage: lang,
      generationVersion: task.research?.generationVersion || "legacy-adaptive-v1",
    },
    metrics: normalizedMetrics,
    tags: summarizeTags([...tags], lang),
    summary:
      lang === "zh"
        ? `${taskTitle} 已完成，AI 根据本轮作答更新了「${strongest.label}」相关画像。`
        : `${taskTitle} completed. AI updated the profile around ${strongest.label}.`,
    headline:
      lang === "zh"
        ? `${taskTitle} 已完成：AI 动态题结果已加入画像。`
        : `${taskTitle} completed: AI-generated task evidence has been added to the profile.`,
  };
}

function localizeGeneratedTaskTitle(task, language) {
  const title = language === "zh" ? task.title_zh || task.title : task.title || task.title_zh;
  return String(title || (language === "zh" ? "AI 动态题" : "AI-generated task"));
}

export function generateFallbackReply({
  language,
  profile,
  careCase,
  counselorStrategy,
  message,
  productSignals,
}) {
  const lang = normalizeLanguage(language);
  const copy = getResearchCopy(lang);
  const tasksLeft = 4 - (profile.completed_task_count || 0);
  const riskLine =
    profile.risk_score === null
      ? copy.summaryPending
      : lang === "zh"
        ? `当前画像显示：${profile.risk_band}，阶段为「${copy.stage[profile.stage]}」。`
        : `Current profile: ${profile.risk_band}, stage: ${copy.stage[profile.stage]}.`;
  const productLine = productSignals.length
    ? lang === "zh"
      ? `我还从你分享的页面里抓到了这些上下文：${productSignals.map((item) => item.summary).join("；")}。`
      : `I also enriched the shared page context: ${productSignals.map((item) => item.summary).join("; ")}.`
    : "";
  const counselorLine =
    careCase?.status === "active"
      ? lang === "zh"
        ? "顾问已经在环，后续我会优先沿着顾问策略继续。"
        : "A counselor is already in the loop, so I will follow that strategy first."
      : counselorStrategy
        ? lang === "zh"
          ? `当前顾问策略提醒：${counselorStrategy}`
          : `Current counselor strategy note: ${counselorStrategy}`
        : "";

  if ((profile.completed_task_count || 0) < 2) {
    return [
      riskLine,
      lang === "zh"
        ? `为了避免直接问卷式判断，我建议你先继续完成剩余的多模态任务。还差 ${tasksLeft} 项。`
        : `To avoid turning this into a direct questionnaire, I suggest finishing the remaining multimodal tasks first. ${tasksLeft} task(s) remain.`,
      productLine,
      lang === "zh"
        ? `优先顺序：${copy.nextMoves.budget_arc}，然后 ${copy.nextMoves.delay_ladder}。`
        : `Suggested order: ${copy.nextMoves.budget_arc}, then ${copy.nextMoves.delay_ladder}.`,
    ]
      .filter(Boolean)
      .join("\n\n");
  }

  const strongest = strongestMetric(profile.metrics, copy);
  const responseLead =
    lang === "zh"
      ? `你刚才提到“${String(message || "").slice(0, 80)}”，这和当前最突出的维度「${strongest.label}」是连在一起的。`
      : `You mentioned "${String(message || "").slice(0, 80)}", which lines up with the strongest current dimension: ${strongest.label}.`;
  const moveLine =
    profile.suggested_moves?.length
      ? lang === "zh"
        ? `我建议先把下一步落到一个可执行动作：${profile.suggested_moves[0]}.`
        : `The next step should become one executable move: ${profile.suggested_moves[0]}.`
      : "";
  const planLine =
    profile.plan?.goal
      ? lang === "zh"
        ? `当前已有「${profile.plan.goalLabel}」行动计划，可以先把这次困扰接到检查点「${profile.plan.steps?.[0] || "第一步"}」。`
        : `A "${profile.plan.goalLabel}" action plan is in place, so connect this moment to checkpoint "${profile.plan.steps?.[0] || "first step"}".`
      : lang === "zh"
        ? `下一步先落到一个可执行动作：延迟、比较、预算检查或非购物替代。`
        : `The next best move is one executable action: delay, compare, check the budget, or use a non-shopping reset.`;
  const helpLine =
    careCase?.status === "suggested"
      ? lang === "zh"
        ? `当前风险或停滞迹象已经达到顾问可接入的门槛：${careCase.ai_reason}`
        : `Risk or stagnation has crossed the handoff threshold: ${careCase.ai_reason}`
      : "";

  return [riskLine, responseLead, productLine, moveLine, planLine, counselorLine, helpLine]
    .filter(Boolean)
    .join("\n\n");
}

export function buildSystemPrompt({ language, profile, careCase, counselorStrategy, productSignals }) {
  const lang = normalizeLanguage(language);
  const languageName = lang === "zh" ? "Simplified Chinese" : "English";
  const metrics = METRIC_KEYS.map((key) => `${key}: ${profile.metrics?.[key] ?? "n/a"}`).join(", ");
  return [
    `You are AgentIS, an indirect-sensing intervention agent for overspending research.`,
    `Reply in ${languageName}.`,
    `Do not ask blunt self-labelling questions such as "are you impulsive?".`,
    `Use the user's multimodal tasks, plan, and shared links as evidence.`,
    `Keep the response supportive, concise, and actionable.`,
    `Current stage: ${profile.stage}; risk_score: ${profile.risk_score ?? "unknown"}; metrics: ${metrics}.`,
    `Current plan: ${JSON.stringify(profile.plan || {})}.`,
    `Counselor case status: ${careCase?.status || "watch"} / ${careCase?.escalation_level || "none"}.`,
    counselorStrategy ? `Counselor strategy note: ${counselorStrategy}` : "",
    productSignals.length ? `External page signals: ${JSON.stringify(productSignals)}` : "",
    `Always map the next reply to one concrete next step, preferably a friction, delay, comparison, or milestone action.`,
  ]
    .filter(Boolean)
    .join("\n");
}

function buildCueTask(copy) {
  return {
    key: "cue_triage",
    kind: "micro_choices",
    estimatedMinutes: TASK_DEFINITIONS.cue_triage.estimatedMinutes,
    title: copy.title,
    description: copy.description,
    theory: copy.theory,
    items: Object.entries(copy.items).map(([key, item], index) => ({
      key,
      index: index + 1,
      prompt: item.prompt,
      options: Object.entries(item.options).map(([optionKey, label]) => ({
        key: optionKey,
        label,
      })),
    })),
  };
}

function buildBudgetTask(copy) {
  return {
    key: "budget_arc",
    kind: "allocation",
    estimatedMinutes: TASK_DEFINITIONS.budget_arc.estimatedMinutes,
    title: copy.title,
    description: copy.description,
    theory: copy.theory,
    hint: copy.hint,
    jars: Object.entries(copy.jars).map(([key, label]) => ({ key, label })),
  };
}

function buildDelayTask(copy) {
  return {
    key: "delay_ladder",
    kind: "ladder",
    estimatedMinutes: TASK_DEFINITIONS.delay_ladder.estimatedMinutes,
    title: copy.title,
    description: copy.description,
    theory: copy.theory,
    items: copy.items,
  };
}

function buildPlanTask(copy) {
  const lang = copy === TASK_COPY.zh.plan_craft ? "zh" : "en";
  const prescription = buildGeneratedPlan({
    primary: "present_bias",
    secondary: "planning_strength",
    language: lang,
    copy,
  });
  return {
    key: "plan_craft",
    kind: "plan_prescription",
    estimatedMinutes: TASK_DEFINITIONS.plan_craft.estimatedMinutes,
    title: copy.title,
    description: copy.description,
    theory: copy.theory,
    prescription,
  };
}

function buildAdaptiveFollowUps(metrics, language) {
  const lang = normalizeLanguage(language);
  const { primary, secondary, third } = selectAdaptiveSignals(metrics);
  return [
    buildAdaptiveMicroTask({ mode: "symbol", primary, secondary, language: lang }),
    buildAdaptiveMicroTask({ mode: "route", primary: secondary, secondary: third, language: lang }),
  ];
}

function buildAdaptiveTaskFromKey(taskKey, language, options = {}) {
  const parsed = parseAdaptiveTaskKey(taskKey);
  if (!parsed) return null;
  if (parsed.type === "micro") {
    return buildAdaptiveMicroTask({
      mode: parsed.mode,
      primary: parsed.primary,
      secondary: parsed.secondary,
      language,
      includeScoring: Boolean(options.includeScoring),
    });
  }
  if (parsed.type === "plan") {
    return buildAdaptivePlanTask({
      primary: parsed.primary,
      secondary: parsed.secondary,
      language,
    });
  }
  return null;
}

function buildAdaptiveMicroTask({ mode, primary, secondary, language, includeScoring = false }) {
  const lang = normalizeLanguage(language);
  const safeMode = ADAPTIVE_MODES.includes(mode) ? mode : "symbol";
  const safePrimary = METRIC_KEYS.includes(primary) ? primary : "present_bias";
  const safeSecondary = METRIC_KEYS.includes(secondary) && secondary !== safePrimary ? secondary : "planning_strength";
  const copy = ADAPTIVE_MODE_COPY[lang][safeMode];
  const reason = ADAPTIVE_MODE_COPY[lang].generatedReason;
  const prompts = rotateList(ADAPTIVE_PROMPTS[lang][safeMode], metricIndex(safePrimary)).slice(0, 5);
  const options = rotateList(buildAdaptiveOptions(lang, safeMode, safePrimary, safeSecondary), metricIndex(safeSecondary));

  return {
    key: adaptiveTaskKey("micro", safeMode, safePrimary, safeSecondary),
    kind: "micro_choices",
    estimatedMinutes: 4,
    title: copy.title,
    description: `${copy.description} ${reason}`,
    theory: copy.theory,
    adaptiveReason: reason,
    items: prompts.map((prompt, index) => ({
      key: `q${index + 1}`,
      index: index + 1,
      prompt,
      options: options.map((option) => includeScoring ? option : ({ key: option.key, label: option.label })),
    })),
  };
}

function buildAdaptivePlanTask({ primary, secondary, language }) {
  const lang = normalizeLanguage(language);
  const safePrimary = METRIC_KEYS.includes(primary) ? primary : "present_bias";
  const safeSecondary = METRIC_KEYS.includes(secondary) && secondary !== safePrimary ? secondary : "planning_strength";
  const copy = ADAPTIVE_MODE_COPY[lang].plan;
  const reason = ADAPTIVE_MODE_COPY[lang].generatedReason;
  const prescription = buildGeneratedPlan({
    primary: safePrimary,
    secondary: safeSecondary,
    language: lang,
    copy,
  });

  return {
    key: adaptiveTaskKey("plan", "script", safePrimary, safeSecondary),
    kind: "plan_prescription",
    estimatedMinutes: 5,
    title: copy.title,
    description: `${copy.description} ${reason}`,
    theory: copy.theory,
    adaptiveReason: reason,
    prescription,
  };
}

function buildGeneratedPlan({ primary, secondary, language, copy }) {
  const lang = normalizeLanguage(language);
  const safePrimary = METRIC_KEYS.includes(primary) ? primary : "present_bias";
  const safeSecondary = METRIC_KEYS.includes(secondary) && secondary !== safePrimary ? secondary : "planning_strength";
  const planCopy = ADAPTIVE_PLAN_COPY[lang];
  const horizonDays = safePrimary === "present_bias" || safePrimary === "cue_drive" ? 14 : 30;
  const support = chooseGeneratedSupport(safePrimary, safeSecondary);
  const action = chooseGeneratedAction(safePrimary, safeSecondary);
  const goal = `soften_${safePrimary}`;
  const trigger = `when_${safePrimary}`;
  const horizonLabel =
    horizonDays === 14
      ? (lang === "zh" ? "2 周" : "2 weeks")
      : (lang === "zh" ? "1 个月" : "1 month");
  const supportLabels = {
    ai_shadow: lang === "zh" ? "系统持续观察并在风险窗口提醒" : "System reminders during risk windows",
    counselor_gate: lang === "zh" ? "达到阈值时自动建议顾问接入" : "Escalate to counselor review after the threshold is crossed",
    peer_anchor: lang === "zh" ? "由一个固定支持者作为外部锚点" : "Use one fixed supporter as an external anchor",
    private_log: lang === "zh" ? "先保留私人记录并复核变化" : "Keep a private log and review changes",
  };
  const actionLabels = {
    [`act_${safePrimary}`]: planCopy.actions[safePrimary],
    [`act_${safeSecondary}`]: planCopy.actions[safeSecondary],
    hide_signal: lang === "zh" ? "隐藏最亮提示 24 小时后再复核" : "Hide the brightest cue for 24 hours, then review it",
    write_one_line: lang === "zh" ? "只写一行理由，然后离开页面" : "Write one reason, then leave the page",
  };
  const steps = buildGeneratedCheckpoints({ primary: safePrimary, secondary: safeSecondary, support, horizonDays, language: lang });

  return {
    source: "ai_prescribed",
    goal,
    goalLabel: planCopy.goals[safePrimary],
    trigger,
    triggerLabel: planCopy.triggers[safePrimary],
    action,
    actionLabel: actionLabels[action] || actionLabels[`act_${safePrimary}`],
    support,
    supportLabel: supportLabels[support],
    horizonDays,
    horizonLabel,
    steps,
    rationale:
      lang === "zh"
        ? `该方案来自当前最突出的「${getResearchCopy(lang).metrics[safePrimary]}」和次级信号「${getResearchCopy(lang).metrics[safeSecondary]}」。`
        : `This plan uses the strongest signal (${getResearchCopy(lang).metrics[safePrimary]}) and the secondary signal (${getResearchCopy(lang).metrics[safeSecondary]}).`,
  };
}

function chooseGeneratedSupport(primary, secondary) {
  if (primary === "help_readiness" || secondary === "help_readiness") return "counselor_gate";
  if (primary === "social_pull" || secondary === "social_pull") return "peer_anchor";
  if (primary === "planning_strength") return "private_log";
  return "ai_shadow";
}

function chooseGeneratedAction(primary, secondary) {
  if (primary === "cue_drive" || primary === "present_bias") return "hide_signal";
  if (primary === "emotion_relief") return `act_${primary}`;
  if (primary === "social_pull") return "write_one_line";
  return `act_${secondary}`;
}

function buildGeneratedCheckpoints({ primary, secondary, support, horizonDays, language }) {
  const lang = normalizeLanguage(language);
  if (lang === "zh") {
    return [
      `第 1 步：遇到「${getResearchCopy(lang).metrics[primary]}」窗口时先执行约定动作，不临时改方案。`,
      `第 2 步：记录一次执行结果，复核「${getResearchCopy(lang).metrics[secondary]}」是否下降。`,
      support === "counselor_gate"
        ? "第 3 步：若连续两次未执行，自动建议顾问介入复核。"
        : `第 3 步：在 ${horizonDays} 天周期结束时复盘并更新下一轮计划。`,
    ];
  }
  return [
    `Step 1: When the ${getResearchCopy(lang).metrics[primary]} window appears, follow the agreed action without changing the plan.`,
    `Step 2: Record one execution result and check whether ${getResearchCopy(lang).metrics[secondary]} is lower.`,
    support === "counselor_gate"
      ? "Step 3: If the action is missed twice in a row, AI recommends counselor review."
      : `Step 3: At the end of the ${horizonDays}-day cycle, review and update the next plan.`,
  ];
}

function buildAdaptiveOptions(language, mode, primary, secondary) {
  const archetypes = ADAPTIVE_ARCHETYPES[normalizeLanguage(language)][mode] || ADAPTIVE_ARCHETYPES.en.symbol;
  return archetypes.map(([key, label, mainMetric, tag]) => ({
    key,
    label,
    tag,
    metrics: buildAdaptiveOptionMetrics(mainMetric, primary, secondary),
  }));
}

function buildAdaptiveOptionMetrics(mainMetric, primary, secondary) {
  const metrics = emptyMetricMap(34);
  metrics[mainMetric] = 82;
  metrics[primary] = Math.max(metrics[primary], 66);
  metrics[secondary] = Math.max(metrics[secondary], 54);
  if (mainMetric === "planning_strength") {
    metrics.present_bias = Math.min(metrics.present_bias, 30);
    metrics.cue_drive = Math.min(metrics.cue_drive, 34);
  }
  if (mainMetric === "help_readiness") {
    metrics.social_pull = Math.max(metrics.social_pull, 58);
  }
  if (mainMetric === "emotion_relief") {
    metrics.present_bias = Math.max(metrics.present_bias, 56);
  }
  return metrics;
}

function adaptiveTaskKey(type, mode, primary, secondary) {
  return `adaptive:${type}:${mode}:${primary}:${secondary}`;
}

function parseAdaptiveTaskKey(taskKey) {
  const [prefix, type, mode, primary, secondary] = String(taskKey || "").split(":");
  if (prefix !== "adaptive") return null;
  if (!["micro", "plan"].includes(type)) return null;
  if (type === "micro" && !ADAPTIVE_MODES.includes(mode)) return null;
  if (type === "plan" && mode !== "script") return null;
  if (!METRIC_KEYS.includes(primary) || !METRIC_KEYS.includes(secondary)) return null;
  return { type, mode, primary, secondary };
}

function isAdaptiveMicroTaskKey(taskKey) {
  return parseAdaptiveTaskKey(taskKey)?.type === "micro";
}

function isAdaptivePlanTaskKey(taskKey) {
  return parseAdaptiveTaskKey(taskKey)?.type === "plan";
}

function selectAdaptiveSignals(metrics) {
  const ranked = METRIC_KEYS
    .map((key) => ({ key, value: Number(metrics?.[key] ?? -1) }))
    .sort((left, right) => right.value - left.value);
  const primary = ranked[0]?.key || "present_bias";
  const secondary = ranked.find((item) => item.key !== primary)?.key || "planning_strength";
  const third = ranked.find((item) => item.key !== primary && item.key !== secondary)?.key || "cue_drive";
  return { primary, secondary, third };
}

function metricIndex(metricKey) {
  return Math.max(0, METRIC_KEYS.indexOf(metricKey));
}

function rotateList(items, offset) {
  if (!items.length) return [];
  const safeOffset = ((offset % items.length) + items.length) % items.length;
  return [...items.slice(safeOffset), ...items.slice(0, safeOffset)];
}

function scoreCueTask(payload, language) {
  const lang = normalizeLanguage(language);
  const taskCopy = TASK_COPY[lang].cue_triage;
  const defs = TASK_DEFINITIONS.cue_triage.items;
  const itemKeys = Object.keys(defs);
  const selections = Object.fromEntries(itemKeys.map((key) => [key, String(payload?.[key] || "")]));

  const metrics = emptyMetricMap(0);
  const tags = new Set();
  for (const [itemKey, optionKey] of Object.entries(selections)) {
    if (!defs[itemKey].options[optionKey]) {
      throw new Error(lang === "zh" ? "请完成全部 10 个选择" : "Please complete all 10 choices.");
    }
    const option = defs[itemKey].options[optionKey];
    for (const key of METRIC_KEYS) {
      metrics[key] += option[key];
    }
    tags.add(option.tag);
  }

  const normalizedMetrics = normalizeAverages(metrics, itemKeys.length);
  return {
    taskKey: "cue_triage",
    payload: selections,
    metrics: normalizedMetrics,
    tags: summarizeTags([...tags], lang),
    summary:
      lang === "zh"
        ? "首轮生活偏好画像已完成，系统已生成接下来的测试路径。"
        : "The first life-preference profile is complete. The next testing path is ready.",
    headline:
      lang === "zh"
        ? `${taskCopy.title} 已完成：行为线索已加入画像。`
        : `${taskCopy.title} completed: the signal has been added to the profile.`,
  };
}

function scoreAdaptiveMicroTask(taskKey, payload, language) {
  const lang = normalizeLanguage(language);
  const task = buildAdaptiveTaskFromKey(taskKey, lang, { includeScoring: true });
  if (!task || task.kind !== "micro_choices") throw new Error("Unknown adaptive task");

  const metrics = emptyMetricMap(0);
  const tags = new Set();
  const selections = {};
  for (const item of task.items) {
    const value = String(payload?.[item.key] || "");
    const option = item.options.find((entry) => entry.key === value);
    if (!option) {
      throw new Error(lang === "zh" ? "请完成这组动态选择" : "Please complete this adaptive choice set.");
    }
    selections[item.key] = value;
    for (const key of METRIC_KEYS) {
      metrics[key] += Number(option.metrics?.[key] || 0);
    }
    tags.add(option.tag);
  }

  const normalizedMetrics = normalizeAverages(metrics, task.items.length);
  const strongest = strongestMetric(normalizedMetrics, getResearchCopy(lang));
  return {
    taskKey,
    payload: selections,
    metrics: normalizedMetrics,
    tags: summarizeTags([...tags], lang),
    summary:
      lang === "zh"
        ? `${task.title} 已完成，AI 生成测试显示当前最突出的隐含维度是「${strongest.label}」。`
        : `${task.title} completed. The generated test's strongest implicit dimension is ${strongest.label}.`,
    headline:
      lang === "zh"
        ? `${task.title} 已完成：动态测试结果已加入画像。`
        : `${task.title} completed: adaptive test evidence has been added to the profile.`,
  };
}

function scoreAdaptivePlanTask(taskKey, payload, language) {
  const lang = normalizeLanguage(language);
  const task = buildAdaptiveTaskFromKey(taskKey, lang);
  if (!task || task.kind !== "plan_prescription") throw new Error("Unknown adaptive plan task");
  const normalizedPlan = normalizePlan(task.prescription);
  if (!normalizedPlan) {
    throw new Error(lang === "zh" ? "行动计划生成失败，请先完成前面的测试。" : "Plan generation failed. Complete the previous tests first.");
  }

  const parsed = parseAdaptiveTaskKey(taskKey);
  const primary = parsed?.primary || "present_bias";
  const secondary = parsed?.secondary || "planning_strength";
  const supportBoost = normalizedPlan.support === "counselor_gate" ? 88 : normalizedPlan.support === "peer_anchor" ? 76 : normalizedPlan.support === "ai_shadow" ? 58 : 46;
  const metrics = emptyMetricMap(38);
  metrics[primary] = 30;
  metrics[secondary] = 42;
  metrics.planning_strength = clamp(70 + Math.min(normalizedPlan.steps.length, 3) * 7 + (normalizedPlan.horizonDays >= 30 ? 4 : 0), 0, 100);
  metrics.help_readiness = supportBoost;
  metrics.present_bias = Math.min(metrics.present_bias, normalizedPlan.action === "hide_signal" || normalizedPlan.action === "write_one_line" ? 30 : 38);

  return {
    taskKey,
    payload: normalizedPlan,
    metrics,
    tags: [
      lang === "zh" ? "动态行动计划" : "Adaptive action plan",
      lang === "zh" ? `计划周期 ${normalizedPlan.horizonLabel}` : `Plan horizon ${normalizedPlan.horizonLabel}`,
      supportBoost >= 76 ? (lang === "zh" ? "支持锚点" : "Support anchor") : (lang === "zh" ? "轻量自控" : "Light self-regulation"),
    ],
    summary:
      lang === "zh"
        ? `已确认 ${normalizedPlan.horizonLabel} 行动计划，包含 ${normalizedPlan.steps.length} 个检查点。`
        : `Action plan confirmed: ${normalizedPlan.horizonLabel} path with ${normalizedPlan.steps.length} checkpoints.`,
    headline:
      lang === "zh"
        ? "行动计划已确认：系统将按检查点追踪进展。"
        : "Action plan confirmed: checkpoints will shape the intervention path.",
  };
}

function scoreBudgetTask(payload, language) {
  const lang = normalizeLanguage(language);
  const values = {
    immediate: numeric(payload?.immediate),
    social: numeric(payload?.social),
    comfort: numeric(payload?.comfort),
    buffer: numeric(payload?.buffer),
    future: numeric(payload?.future),
  };
  const total = Object.values(values).reduce((sum, value) => sum + value, 0);
  if (total !== 100) {
    throw new Error(lang === "zh" ? "预算代币总和必须为 100" : "Budget tokens must add up to 100.");
  }

  const rewardLoad = values.immediate + values.comfort;
  const supportLoad = values.buffer + values.future;
  const metrics = {
    cue_drive: clamp(35 + values.immediate * 0.7 + values.social * 0.25, 0, 100),
    emotion_relief: clamp(20 + values.comfort * 1.2, 0, 100),
    social_pull: clamp(24 + values.social * 1.2, 0, 100),
    present_bias: clamp(28 + rewardLoad * 0.65, 0, 100),
    planning_strength: clamp(20 + supportLoad * 0.75, 0, 100),
    help_readiness: clamp(24 + values.social * 0.2 + values.buffer * 0.2, 0, 100),
  };
  return {
    taskKey: "budget_arc",
    payload: values,
    metrics,
    tags: summarizeBudgetTags(values, lang),
    summary:
      lang === "zh"
        ? `预算代币已分配：即时奖励 ${values.immediate + values.comfort}，未来缓冲 ${supportLoad}。`
        : `Budget tokens allocated: ${values.immediate + values.comfort} toward reward, ${supportLoad} toward future/buffer.`,
    headline:
      lang === "zh"
        ? "预算弧线已完成：奖励与缓冲偏好已记录。"
        : "Budget Arc completed: reward and buffering preferences recorded.",
  };
}

function scoreDelayTask(payload, language) {
  const lang = normalizeLanguage(language);
  const keys = ["q1", "q2", "q3", "q4", "q5"];
  const choices = {};
  let laterCount = 0;
  for (const key of keys) {
    const value = String(payload?.[key] || "");
    if (value !== "now" && value !== "later") {
      throw new Error(lang === "zh" ? "请完成所有时间选择" : "Please answer all delay ladder items.");
    }
    choices[key] = value;
    if (value === "later") laterCount += 1;
  }

  const laterRatio = laterCount / keys.length;
  const metrics = {
    cue_drive: clamp(48 - laterRatio * 14, 0, 100),
    emotion_relief: clamp(44 - laterRatio * 10, 0, 100),
    social_pull: clamp(46 - laterRatio * 8, 0, 100),
    present_bias: clamp(84 - laterRatio * 52, 0, 100),
    planning_strength: clamp(24 + laterRatio * 60, 0, 100),
    help_readiness: clamp(32 + laterRatio * 18, 0, 100),
  };
  return {
    taskKey: "delay_ladder",
    payload: choices,
    metrics,
    tags:
      laterCount >= 3
        ? [lang === "zh" ? "未来导向较强" : "Future-oriented"]
        : [lang === "zh" ? "即时回报偏好明显" : "Stronger immediate-reward pull"],
    summary:
      lang === "zh"
        ? `时间阶梯已完成：${laterCount} / 5 次选择了延迟收益。`
        : `Horizon ladder completed: chose the delayed option ${laterCount}/5 times.`,
    headline:
      lang === "zh"
        ? "时间阶梯已完成：即时偏好画像已更新。"
        : "Horizon Ladder completed: present-bias profile updated.",
  };
}

function scorePlanTask(payload, language) {
  const lang = normalizeLanguage(language);
  const copy = TASK_COPY[lang].plan_craft;
  const normalizedPlan = normalizePlan(buildGeneratedPlan({
    primary: "present_bias",
    secondary: "planning_strength",
    language: lang,
    copy,
  }));
  if (!normalizedPlan) {
    throw new Error(lang === "zh" ? "行动计划生成失败。" : "Plan generation failed.");
  }

  const supportBoost = normalizedPlan.support === "counselor_gate" ? 90 : normalizedPlan.support === "peer_anchor" ? 72 : 58;
  const metrics = {
    cue_drive: 34,
    emotion_relief: 42,
    social_pull: normalizedPlan.support === "peer_anchor" ? 58 : 40,
    present_bias: 28,
    planning_strength: clamp(68 + Math.min(normalizedPlan.steps.length, 3) * 8 + (normalizedPlan.horizonDays >= 30 ? 4 : 0), 0, 100),
    help_readiness: supportBoost,
  };

  return {
    taskKey: "plan_craft",
    payload: normalizedPlan,
    metrics,
    tags: [
      lang === "zh" ? "行动计划" : "Action plan",
      lang === "zh" ? `计划周期 ${normalizedPlan.horizonLabel}` : `Plan horizon ${normalizedPlan.horizonLabel}`,
      lang === "zh" ? "医生式方案确认" : "Clinician-style path confirmed",
    ],
    summary:
      lang === "zh"
        ? `已确认 ${normalizedPlan.horizonLabel} 行动计划，并设置 ${normalizedPlan.steps.length} 个检查点。`
        : `Confirmed a ${normalizedPlan.horizonLabel} action plan with ${normalizedPlan.steps.length} checkpoints.`,
    headline:
      lang === "zh"
        ? "行动计划已确认：系统将按检查点追踪进展。"
        : "Action plan confirmed: checkpoints will shape the intervention path.",
  };
}

function determineStage({ completedTaskCount, plan, riskScore, previousRisk }) {
  if (!completedTaskCount) return "orientation";
  if (completedTaskCount <= 1) return "sensing";
  if (!plan) return "mapping";
  if (riskScore !== null && previousRisk !== null && riskScore <= previousRisk - 8) return "stabilizing";
  if (riskScore !== null && riskScore <= 38) return "stabilizing";
  return "intervening";
}

function buildTriggers(latestEvents, metrics, copy) {
  const tags = new Set();
  const cueTags = parseJson(latestEvents.cue_triage?.score_json || "{}", {}).tags || [];
  cueTags.forEach((tag) => tags.add(tag));
  if ((metrics.emotion_relief ?? 0) >= 70) tags.add(copy.triggerLabels.mood_relief);
  if ((metrics.social_pull ?? 0) >= 68) tags.add(copy.triggerLabels.social_proof);
  if ((metrics.present_bias ?? 0) >= 72) tags.add(copy.triggerLabels.instant_reward);
  if ((metrics.cue_drive ?? 0) >= 72) tags.add(copy.triggerLabels.countdown);
  return [...tags].slice(0, 6);
}

function buildProtectiveFactors(metrics, plan, copy) {
  const items = [];
  if ((metrics.planning_strength ?? 0) >= 60) items.push(copy.protectiveFactors.planning);
  if ((metrics.help_readiness ?? 0) >= 60) items.push(copy.protectiveFactors.support);
  if (plan?.action === "budget" || plan?.action === "hide_signal") items.push(copy.protectiveFactors.buffer);
  if (plan?.action === "wait" || plan?.action === "write_one_line") items.push(copy.protectiveFactors.reflection);
  if (plan?.goal === "protect_goal" || String(plan?.goal || "").startsWith("soften_")) items.push(copy.protectiveFactors.future);
  return [...new Set(items)].slice(0, 5);
}

function buildSuggestedMoves(metrics, plan, copy) {
  const moves = [];
  if ((metrics.present_bias ?? 0) >= 68) moves.push(copy.suggestedMoves.delay_rule);
  if ((metrics.social_pull ?? 0) >= 65) moves.push(copy.suggestedMoves.social_buffer);
  if ((metrics.emotion_relief ?? 0) >= 68) moves.push(copy.suggestedMoves.mood_detour);
  if ((metrics.cue_drive ?? 0) >= 68) moves.push(copy.suggestedMoves.friction_stack);
  if (plan?.support === "counselor" || plan?.support === "counselor_gate" || (metrics.help_readiness ?? 0) >= 72) moves.push(copy.suggestedMoves.counselor_join);
  return [...new Set(moves)].slice(0, 5);
}

function buildEvidence(latestEvents, messageSignals, copy) {
  const evidence = [];
  for (const key of Object.keys(latestEvents)) {
    if (copy.evidenceNotes[key]) evidence.push(copy.evidenceNotes[key]);
    else if (String(key).startsWith("adaptive:")) evidence.push(copy.evidenceNotes.adaptive);
  }
  if (messageSignals.regretCount) evidence.push(copy.evidenceNotes.message_regret);
  if (messageSignals.guardCount) evidence.push(copy.evidenceNotes.message_guard);
  if (messageSignals.urlCount) evidence.push(copy.evidenceNotes.url_signal);
  return [...new Set(evidence)].slice(0, 8);
}

function buildSummary({ copy, completedTaskCount, plan, riskBand, riskScore, stage, triggers, protectiveFactors }) {
  if (!completedTaskCount) return copy.summaryPending;
  const triggerText = triggers.length ? triggers.join(", ") : stageLabel(stage, copy);
  const protectiveText = protectiveFactors.length
    ? protectiveFactors.join(", ")
    : copy.nextMoves.plan_craft;
  if (riskScore === null) {
    return copy.summaryPending;
  }
  return copy === UI_COPY.zh
    ? `当前处于「${copy.stage[stage]}」：系统通过间接任务判断你更容易受 ${triggerText} 影响；当前保护因素主要是 ${protectiveText}。综合风险为 ${riskBand}${typeof riskScore === "number" ? `（${riskScore}）` : ""}。${plan ? ` 已建立 ${plan.horizonLabel} 行动计划。` : ""}`
    : `Stage: ${copy.stage[stage]}. Indirect tasks suggest stronger sensitivity to ${triggerText}; current protective factors are ${protectiveText}. Overall risk is ${riskBand}${typeof riskScore === "number" ? ` (${riskScore})` : ""}.${plan ? ` A ${plan.horizonLabel} action plan is in place.` : ""}`;
}

function riskBandText(value, copy) {
  if (value === null || value === undefined) return copy.labels.riskPending;
  if (value >= 70) return copy.labels.riskHigh;
  if (value >= 45) return copy.labels.riskMedium;
  return copy.labels.riskLow;
}

function strongestMetric(metrics, copy) {
  return METRIC_KEYS
    .map((key) => ({ key, label: copy.metrics[key], value: Number(metrics?.[key] ?? -1) }))
    .sort((left, right) => right.value - left.value)[0] || { key: "cue_drive", label: copy.metrics.cue_drive, value: 0 };
}

function weightedRisk(metrics) {
  const cue = metrics.cue_drive ?? 50;
  const emotion = metrics.emotion_relief ?? 50;
  const social = metrics.social_pull ?? 50;
  const present = metrics.present_bias ?? 50;
  const planning = metrics.planning_strength ?? 50;
  return cue * 0.24 + emotion * 0.18 + social * 0.14 + present * 0.28 + (100 - planning) * 0.16;
}

function inspectMessages(messages) {
  const text = (messages || [])
    .map((item) => String(item.content || ""))
    .join(" ")
    .toLowerCase();
  const regretCount = countKeywordHits(text, MESSAGE_HINTS.regret);
  const guardCount = countKeywordHits(text, MESSAGE_HINTS.guard);
  const helpCount = countKeywordHits(text, MESSAGE_HINTS.help);
  const urlCount = (text.match(/https?:\/\/\S+/g) || []).length;
  return {
    regretCount,
    guardCount,
    helpCount,
    urlCount,
    cueBoost: Math.min(regretCount * 2, 8),
    emotionBoost: Math.min(regretCount * 3, 10),
    presentBoost: Math.min(regretCount * 2, 8),
    guardBoost: Math.min(guardCount * 3, 10),
    helpBoost: Math.min(helpCount * 6, 14),
  };
}

function summarizeTags(tags, language) {
  const lang = normalizeLanguage(language);
  const copy = getResearchCopy(lang);
  return tags.map((tag) => {
    if (tag === "countdown") return copy.triggerLabels.countdown;
    if (tag === "mood_relief") return copy.triggerLabels.mood_relief;
    if (tag === "social_proof") return copy.triggerLabels.social_proof;
    if (tag === "recommendation") return copy.triggerLabels.recommendation;
    if (tag === "instant_reward") return copy.triggerLabels.instant_reward;
    if (tag === "buffer") return lang === "zh" ? "边界意识" : "Boundary awareness";
    if (tag === "reflection") return lang === "zh" ? "反思停顿" : "Reflective pause";
    if (tag === "planning") return lang === "zh" ? "计划取向" : "Planning orientation";
    if (tag === "support") return lang === "zh" ? "支持取向" : "Support orientation";
    return tag;
  });
}

function summarizeBudgetTags(values, language) {
  const lang = normalizeLanguage(language);
  const tags = [];
  if (values.immediate + values.comfort >= 45) tags.push(lang === "zh" ? "奖励导向" : "Reward heavy");
  if (values.buffer + values.future >= 45) tags.push(lang === "zh" ? "未来缓冲导向" : "Future / buffer heavy");
  if (values.social >= 24) tags.push(lang === "zh" ? "社交消费占比高" : "Social spending notable");
  return tags;
}

function extractPlanFromLatestEvents(latestEvents) {
  if (!latestEvents || typeof latestEvents !== "object") return null;
  const planEvent =
    latestEvents.plan_craft ||
    Object.values(latestEvents).find((event) => isAdaptivePlanTaskKey(event?.task_key));
  return extractPlanFromLatestEvent(planEvent);
}

function extractPlanFromLatestEvent(event) {
  if (!event) return null;
  const score = parseJson(event.score_json, {});
  return normalizePlan(score.payload || parseJson(event.payload_json, {}));
}

function normalizePlan(plan) {
  if (!plan || typeof plan !== "object") return null;
  const steps = Array.isArray(plan.steps) ? plan.steps.map((item) => String(item).trim()).filter(Boolean) : [];
  if (!plan.goal || !steps.length) return null;
  return {
    goal: String(plan.goal),
    goalLabel: String(plan.goalLabel || plan.goal),
    trigger: String(plan.trigger || ""),
    triggerLabel: String(plan.triggerLabel || plan.trigger || ""),
    action: String(plan.action || ""),
    actionLabel: String(plan.actionLabel || plan.action || ""),
    support: String(plan.support || ""),
    supportLabel: String(plan.supportLabel || plan.support || ""),
    horizonDays: Number(plan.horizonDays || 30),
    horizonLabel: String(plan.horizonLabel || `${plan.horizonDays || 30}`),
    steps: steps.slice(0, 3),
  };
}

function latestEventMap(events) {
  return (events || [])
    .slice()
    .sort((left, right) => new Date(right.created_at).getTime() - new Date(left.created_at).getTime())
    .reduce((accumulator, event) => {
      if (!accumulator[event.task_key]) accumulator[event.task_key] = event;
      return accumulator;
    }, {});
}

function normalizeCareCase(careCase) {
  if (!careCase) {
    return {
      status: "watch",
      escalation_level: "none",
      ai_reason: "",
      counselor_strategy: "",
      last_human_message_at: null,
      plan: null,
    };
  }
  return {
    status: String(careCase.status || "watch"),
    escalation_level: String(careCase.escalation_level || "none"),
    ai_reason: String(careCase.ai_reason || ""),
    counselor_strategy: String(careCase.counselor_strategy || ""),
    last_human_message_at: careCase.last_human_message_at || null,
    plan: normalizePlan(parseJson(careCase.plan_json || "{}", {})),
  };
}

function mostRecentRisk(snapshots) {
  if (!snapshots?.length) return null;
  const latest = [...snapshots].sort((left, right) => new Date(right.created_at).getTime() - new Date(left.created_at).getTime())[0];
  return latest?.risk_score ?? null;
}

function normalizeAverages(metricTotals, divisor) {
  const output = {};
  for (const key of METRIC_KEYS) {
    output[key] = clamp(metricTotals[key] / divisor, 0, 100);
  }
  return output;
}

function emptyMetricMap(initial) {
  return Object.fromEntries(METRIC_KEYS.map((key) => [key, initial]));
}

function mapOptions(source) {
  return Object.entries(source).map(([key, label]) => ({ key, label }));
}

function optionMap(options) {
  return Object.fromEntries((options || []).map((option) => [String(option.key), String(option.label)]));
}

function countKeywordHits(text, keywords) {
  return keywords.reduce((count, keyword) => count + (text.includes(keyword.toLowerCase()) ? 1 : 0), 0);
}

function average(values) {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function numeric(value) {
  const number = Number(value);
  return Number.isFinite(number) ? Math.max(0, Math.min(100, Math.round(number))) : 0;
}

function clamp(value, min, max) {
  const number = Number(value);
  if (!Number.isFinite(number)) return min;
  return Math.max(min, Math.min(max, Math.round(number)));
}

function parseJson(value, fallback) {
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function shortDate(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return `${String(date.getMonth() + 1).padStart(2, "0")}/${String(date.getDate()).padStart(2, "0")}`;
}

function stageLabel(stage, copy) {
  return copy.stage[stage] || stage;
}

function isProgrammingError(error) {
  return error instanceof TypeError ||
    error instanceof ReferenceError ||
    error instanceof SyntaxError;
}
