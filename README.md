# AgentIS

AgentIS is a brand-new Cloudflare Workers research prototype for **indirectly detecting and mitigating overspending habits**. It does not reuse the old `AI-ISP` database or deployment. The current live deployment is:

- `https://agentis.roeyqian.workers.dev`

## What Changed From The Old Direction

The old app relied too heavily on direct conversation and questionnaire-like prompts. This new version implements the advisor feedback as a fresh system with three concrete research moves:

1. **Indirect multimodal detection**
   - `Life Preference Portrait`: 8 original everyday scenario choices plus 2 short written continuations, rather than a blunt self-report battery.
   - `Budget Arc`: token allocation across reward, comfort, social, buffer, and future jars.
   - `Horizon Ladder`: delay-discounting tradeoffs to estimate present bias.
   - `Bilingual Adaptive Micro-Probes`: each AI-generated follow-up combines a scenario choice, short completion, and original abstract-cue slider; it stores semantically aligned English and Simplified Chinese text while the participant API returns only the selected language.

2. **Human-in-the-loop counselor workflow**
   - A dedicated counselor account can review participant cases, see the same evidence chain, send messages into the shared thread, and override strategy.
   - Participants can explicitly invite the counselor when AI-only support is not enough.

3. **More original visualization**
   - `Intervention Bloom`: a flower-like radial visualization for cue pull, mood buying, social pull, present bias, planning strength, and help openness.
   - `Progress Path`: a longitudinal trajectory over profile snapshots.
   - `Milestone Ladder`: counselor-facing milestones when a plan is part of a case.

4. **Theory-grounded intervention**
   - Trait-level personality and self-regulation constructs
   - Reward / punishment sensitivity
   - Delay discounting
   - Implementation intentions
   - Stepped-care / counselor escalation

There is also a lightweight **page enrichment hook**: if a participant pastes shopping URLs into chat, the Worker tries to extract page title and price context to enrich evidence without asking for transaction records.

## Psychometric Theory Notes

The first-stage `Life Preference Portrait` uses original, indirect scenario items. It does **not** copy items from proprietary or standardized instruments, and it is not a clinical diagnosis. The design borrows construct logic from well-established psychological assessment and behavioral-science traditions:

- **Big Five / Five-Factor Model**: especially conscientiousness, extraversion, neuroticism / emotional stability, and openness. These inform items about planning, social celebration, novelty seeking, and quiet recovery.
- **HEXACO model**: used as a complementary trait frame for emotionality, extraversion, conscientiousness, and agreeableness-related social orientation.
- **BIS/BAS theory**: behavioral inhibition / behavioral activation concepts inform how the app interprets approach toward vivid opportunities versus cautious waiting.
- **UPPS-P impulsive behavior model**: urgency, lack of premeditation, sensation seeking, and perseverance inform the latent scoring behind time-window, failed-plan, and reward/reset scenarios.
- **Brief Self-Control / self-regulation theory**: informs items about list use, planned follow-through, resisting immediate substitution, and maintaining prior intentions.
- **Delay discounting / temporal choice theory**: informs the system's later adaptive `Horizon Ladder` task and the first-stage signals around immediate versus delayed restoration.
- **Regulatory Focus Theory**: promotion-focused approach versus prevention-focused security informs how celebration, travel, and recovery preferences are interpreted.
- **Theory of Planned Behavior**: attitudes, perceived control, and social norms inform the social-check and recommendation-style options.
- **Social support and interpersonal regulation research**: informs options where participants seek advice, co-regulation, or shared decision-making.

The key research choice is to separate **surface content** from **latent scoring**. A participant sees ordinary questions such as birthday celebration style, travel packing, restaurant selection, or weekend recovery. The first-stage written continuations are preserved as qualitative evidence and do not themselves create a risk score; the eight structured choices map to AgentIS dimensions: cue sensitivity, affect regulation, social influence, present-bias tendency, planning strength, and help readiness. After the first profile pass, the Worker dynamically orders the next tasks so the participant is guided to the most informative follow-up instead of seeing every module at once.

## Adaptive Bilingual Task Protocol

AI-generated follow-up tasks contain exactly one `choice`, one `fill_blank`, and one `projective_slider` item. The prototype rejects incomplete language pairs, preserves both versions in its generated-task record, and filters the task API response to the participant's selected language. It chooses two high-priority profile dimensions for each follow-up, rotates away from dimensions already targeted by earlier generated tasks, and retains the approved source identifiers used for the task so the adaptive evidence chain can be audited later.

### Adaptive Item Formats and Sources

`projective_slider` creates a unique, original SVG form for each generated task and persists it in the `roey-ai-is-store` R2 bucket. The task record retains the opaque image ID, so the same task always shows the same stimulus while different tasks receive different imagery. It first asks the participant for a short free association—what the form resembles or brings to mind—then asks them to locate their likely response to an unexpected offer on an approach-versus-pause continuum. The free association is retained as qualitative evidence; the slider contributes the structured, momentary response measure. This format is visually inspired by the broad use of ambiguous stimuli in psychological research, but it is **not a Rorschach test**: it does not reproduce Rorschach material, administer its procedure, use its norms, or make clinical or personality-diagnostic claims. It is exploratory rather than a validated diagnostic instrument.

The generator can cite only the following source identifiers, which are stored with the generated task:

- `consumer_impulse` — Rook, D. W. (1987). *The Buying Impulse*. Journal of Consumer Research, 14(2), 189–199.
- `impulse_buying_tendency` — Verplanken, B., & Herabadi, A. G. (2001). *Individual Differences in Impulse Buying Tendency: Feeling and No Thinking*. Journal of Economic Psychology, 22(1), 71–83.
- `delay_discounting` — Kable, J. W., & Glimcher, P. W. (2007). *The Neural Correlates of Subjective Value During Intertemporal Choice*. Nature Neuroscience, 10, 1625–1633.
- `ambiguous_stimulus` — McClelland, D. C., Koestner, R., & Weinberger, J. (1989). *How Do Self-Attributed and Implicit Motives Differ?* Psychological Review, 96(4), 690–702.

Before the abstract-cue format is used for substantive research claims, validate it against established impulse-buying and self-regulation measures, assess test–retest reliability and language invariance, and obtain ethics approval appropriate to the study population.

## Stack

- Cloudflare Workers
- Cloudflare D1
- Cloudflare KV
- Cloudflare R2
- Static frontend assets served by the Worker
- Optional OpenAI-compatible provider configured per participant

## Project Structure

```text
view/
  index.html
  script.js
  style.css
  translation.js
  assets/

worker/
  src/app/index.js
  src/app/http.js
  src/app/routes.js
  src/modules/
    auth/          # session and account access
    participant/   # chat, tasks, insights, AI settings
    counselor/     # care cases and human intervention
    admin/         # user administration
    public/        # public stimulus resources
    api/service.js # application services and persistence orchestration
  src/research.js
  src/migrations/
  wrangler.jsonc
  package.json
```

The Worker follows an application / HTTP / module-route structure. `app/index.js`
owns Cloudflare Worker events, `app/http.js` owns routing and API error handling,
and each domain module owns its route registration and service facade. The shared
application service keeps the existing research workflows and storage operations
behind those module boundaries, so new domains can be added without expanding the
Worker entry point.

## Fresh Cloudflare Resources

This project uses a fully new backend, not a migrated one:

- D1: `roey-ai-is-base` (binding `d1`)
- KV: `roey-ai-is-cache` (binding `kv`)
- R2: `roey-ai-is-store` (binding `r2`)
- Worker: `agentis`

## Accounts

- There are no default accounts.
- Register user ID `root` to create the super administrator account.
- The `root` account has all counselor permissions and can delete any account.

## Local Development

From `worker/`:

```bash
npm install
npx wrangler types
npx wrangler d1 migrations apply roey-ai-is-base --local
npm run dev
```

## Deployment

From `worker/`:

```bash
npx wrangler d1 migrations apply roey-ai-is-base --remote
npx wrangler deploy
```

## Validation Completed

The current deployment was validated by:

- loading the production homepage
- logging in with a test participant
- reading the task catalog
- submitting a cue-triage task
- reading updated insights from production

## Research Framing Notes

This implementation is intentionally more differentiated from the old `AI-ISP` and from direct-questionnaire systems:

- it moves detection **before** and **beyond** point-of-purchase chat
- it adds **non-text tasks** rather than only LLM dialogue
- it treats counselor participation as a first-class workflow
- it visualizes intervention progress as an evolving structure, not just a score

The next research step is not more engineering boilerplate. It is a tighter literature-grounded argument about why these mechanisms together fill a gap left by questionnaire-driven or single-surface intervention systems.
