ALTER TABLE posts
  ADD COLUMN IF NOT EXISTS qa_fights_first  integer DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS qa_fight_on_death boolean DEFAULT NULL;
