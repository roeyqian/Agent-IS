CREATE TABLE IF NOT EXISTS generated_task_jobs (
  user_id TEXT NOT NULL,
  question_index INTEGER NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('generating', 'completed', 'failed')),
  error_message TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  PRIMARY KEY (user_id, question_index),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
