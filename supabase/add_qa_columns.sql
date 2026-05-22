ALTER TABLE posts
  ADD COLUMN IF NOT EXISTS qa_infiltrators     integer DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS qa_deep_strike      integer DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS qa_scout            integer DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS qa_lone_operative   integer DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS qa_advance_charge   boolean DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS qa_surge_move       boolean DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS qa_reactive_move    boolean DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS qa_reserves         boolean DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS qa_feel_no_pain     boolean DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS qa_damage_reduction boolean DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS qa_oc_modifier      boolean DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS qa_battleshock      boolean DEFAULT NULL;
