CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  role TEXT NOT NULL DEFAULT 'participant' CHECK (role IN ('participant', 'counselor', 'superadmin')),
  password_hash TEXT NOT NULL,
  salt TEXT NOT NULL,
  created_at TEXT NOT NULL,
  last_login_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS messages (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'counselor', 'system')),
  content TEXT NOT NULL,
  metadata_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_messages_user_created
ON messages (user_id, created_at);

CREATE TABLE IF NOT EXISTS task_events (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  task_key TEXT NOT NULL,
  payload_json TEXT NOT NULL,
  score_json TEXT NOT NULL,
  created_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_task_events_user_task_created
ON task_events (user_id, task_key, created_at);

CREATE TABLE IF NOT EXISTS user_profiles (
  user_id TEXT PRIMARY KEY,
  profile_json TEXT NOT NULL,
  summary TEXT NOT NULL DEFAULT '',
  risk_score INTEGER,
  stage TEXT NOT NULL DEFAULT 'orientation',
  updated_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS care_cases (
  user_id TEXT PRIMARY KEY,
  status TEXT NOT NULL DEFAULT 'watch' CHECK (status IN ('watch', 'suggested', 'active', 'resolved')),
  escalation_level TEXT NOT NULL DEFAULT 'none' CHECK (escalation_level IN ('none', 'recommended', 'urgent', 'human')),
  ai_reason TEXT NOT NULL DEFAULT '',
  counselor_strategy TEXT NOT NULL DEFAULT '',
  plan_json TEXT NOT NULL DEFAULT '{}',
  last_human_message_at TEXT,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS profile_snapshots (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  risk_score INTEGER,
  stage TEXT NOT NULL,
  metrics_json TEXT NOT NULL,
  created_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_profile_snapshots_user_created
ON profile_snapshots (user_id, created_at);

CREATE TABLE IF NOT EXISTS user_ai_settings (
  user_id TEXT PRIMARY KEY,
  request_url TEXT NOT NULL,
  model TEXT NOT NULL,
  api_key TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS user_features (
  user_id TEXT NOT NULL,
  category TEXT NOT NULL,
  feature TEXT NOT NULL,
  last_seen_at TEXT NOT NULL,
  PRIMARY KEY (user_id, category, feature),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_user_features_category
ON user_features (category, feature);

CREATE TABLE IF NOT EXISTS common_features (
  category TEXT NOT NULL,
  feature TEXT NOT NULL,
  count INTEGER NOT NULL DEFAULT 0,
  last_seen_at TEXT NOT NULL,
  PRIMARY KEY (category, feature)
);

CREATE INDEX IF NOT EXISTS idx_common_features_count
ON common_features (count DESC, last_seen_at DESC);
