DELETE FROM users
WHERE id = 'counselor'
  AND role = 'counselor';

UPDATE users
SET role = 'counselor'
WHERE id = 'root';
