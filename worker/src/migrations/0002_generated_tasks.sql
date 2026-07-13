CREATE TABLE IF NOT EXISTS generated_tasks (
  task_key TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed')),
  task_json TEXT NOT NULL,
  source_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL,
  completed_at TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_generated_tasks_user_status_created
ON generated_tasks (user_id, status, created_at);
