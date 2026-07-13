# AgentIS

AgentIS is a brand-new Cloudflare Workers research prototype for **indirectly detecting and mitigating overspending habits**. It does not reuse the old `AI-ISP` database or deployment. The current live deployment is:

- `https://agentis.roeyqian.workers.dev`

## What Changed From The Old Direction

The old app relied too heavily on direct conversation and questionnaire-like prompts. This new version implements the advisor feedback as a fresh system with three concrete research moves:

1. **Indirect multimodal detection**
   - `Life Preference Portrait`: 10 original everyday scenario choices instead of blunt self-report or shopping-specific prompts.
   - `Budget Arc`: token allocation across reward, comfort, social, buffer, and future jars.
   - `Horizon Ladder`: delay-discounting tradeoffs to estimate present bias.
   - `Bilingual Adaptive Micro-Probes`: each AI-generated follow-up stores semantically aligned English and Simplified Chinese text for its title, rationale, prompts, and options, while the participant API returns only the selected language.

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

The key research choice is to separate **surface content** from **latent scoring**. A participant sees ordinary questions such as birthday celebration style, travel packing, restaurant selection, or weekend recovery. The backend maps those choices to AgentIS dimensions: cue sensitivity, affect regulation, social influence, present-bias tendency, planning strength, and help readiness. After the first profile pass, the Worker dynamically orders the next tasks so the participant is guided to the most informative follow-up instead of seeing every module at once.

## Adaptive Bilingual Task Protocol

AI-generated follow-up tasks use stable option keys and metric mappings, while all participant-facing text is produced as an English/Simplified Chinese pair in one generation. The prototype rejects incomplete language pairs, preserves both versions in its generated-task record, and filters the task API response to the participant's selected language. It chooses two high-priority profile dimensions for each follow-up and rotates away from dimensions already targeted by earlier generated tasks, improving construct coverage across the five-task adaptive sequence. Research exports include the generated task text, focus dimensions, generation version, model identifier, and response language so the adaptive evidence chain can be audited later.

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
  src/index.js
  src/research.js
  src/migrations/0001_init.sql
  wrangler.jsonc
  package.json
```

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
