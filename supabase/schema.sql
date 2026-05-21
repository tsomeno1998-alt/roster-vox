-- =============================================
-- Roster Vox — Database Schema
-- Supabase SQL Editor で実行してください
-- =============================================


-- =============================================
-- Helper: updated_at 自動更新トリガー関数
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- =============================================
-- 1. profiles
-- =============================================
CREATE TABLE IF NOT EXISTS profiles (
  id           UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username     TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  avatar_url   TEXT,
  bio          TEXT,
  created_at   TIMESTAMPTZ DEFAULT now() NOT NULL
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles: authenticated read" ON profiles
  FOR SELECT TO authenticated USING (true);

-- upsert（プロフィール編集）でトリガーが失敗した場合の保険
CREATE POLICY "profiles: own insert" ON profiles
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles: own update" ON profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id);

-- サインアップ時に profiles を自動生成
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  v_username     TEXT;
  v_display_name TEXT;
BEGIN
  -- ユーザー名: Discord は user_name、Google はメールプレフィックス
  v_username := COALESCE(
    NEW.raw_user_meta_data->>'user_name',
    SPLIT_PART(NEW.email, '@', 1)
  );
  -- 記号除去・小文字化
  v_username := LOWER(REGEXP_REPLACE(v_username, '[^a-zA-Z0-9_]', '', 'g'));
  IF v_username = '' THEN
    v_username := 'user';
  END IF;
  -- UUID 先頭6文字を付与して重複を防ぐ
  v_username := v_username || '_' || SUBSTR(REPLACE(NEW.id::text, '-', ''), 1, 6);

  v_display_name := COALESCE(
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'name',
    v_username
  );

  INSERT INTO profiles (id, username, display_name)
  VALUES (NEW.id, v_username, v_display_name)
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RETURN NEW; -- profiles 生成失敗でもサインアップはブロックしない
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();


-- =============================================
-- 2. factions（アーミーマスター）
-- =============================================
CREATE TABLE IF NOT EXISTS factions (
  id      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name    TEXT UNIQUE NOT NULL,
  "group" TEXT NOT NULL CHECK ("group" IN ('Imperium', 'Chaos', 'Xenos'))
);

ALTER TABLE factions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "factions: authenticated read" ON factions
  FOR SELECT TO authenticated USING (true);

-- シードデータ
INSERT INTO factions (name, "group") VALUES
  -- Imperium
  ('Space Marines',            'Imperium'),
  ('Ultramarines',             'Imperium'),
  ('Iron Hands',               'Imperium'),
  ('Salamanders',              'Imperium'),
  ('Raven Guard',              'Imperium'),
  ('White Scars',              'Imperium'),
  ('Imperial Fists',           'Imperium'),
  ('Black Templars',           'Imperium'),
  ('Blood Angels',             'Imperium'),
  ('Dark Angels',              'Imperium'),
  ('Grey Knights',             'Imperium'),
  ('Space Wolves',             'Imperium'),
  ('Deathwatch',               'Imperium'),
  ('Adeptus Custodes',         'Imperium'),
  ('Adepta Sororitas',         'Imperium'),
  ('Adeptus Mechanicus',       'Imperium'),
  ('Astra Militarum',          'Imperium'),
  ('Imperial Knights',         'Imperium'),
  ('Agents of the Imperium',   'Imperium'),
  -- Chaos
  ('Chaos Space Marines',      'Chaos'),
  ('Chaos Daemons',            'Chaos'),
  ('Death Guard',              'Chaos'),
  ('Thousand Sons',            'Chaos'),
  ('World Eaters',             'Chaos'),
  ('Emperor''s Children',      'Chaos'),
  ('Chaos Knights',            'Chaos'),
  -- Xenos
  ('Aeldari',                  'Xenos'),
  ('Drukhari',                 'Xenos'),
  ('Genestealer Cults',        'Xenos'),
  ('Leagues of Votann',        'Xenos'),
  ('Necrons',                  'Xenos'),
  ('Orks',                     'Xenos'),
  ('Tyranids',                 'Xenos'),
  ('T''au Empire',             'Xenos')
ON CONFLICT (name) DO NOTHING;


-- =============================================
-- 3. posts（ロスター投稿）
-- =============================================
CREATE TABLE IF NOT EXISTS posts (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  faction_id   UUID NOT NULL REFERENCES factions(id),
  points       INTEGER NOT NULL CHECK (points IN (500, 1000, 1500, 2000, 3000)),
  title        TEXT NOT NULL,
  concept      TEXT,
  roster_text  TEXT NOT NULL,
  photo_url    TEXT,
  win          INTEGER NOT NULL DEFAULT 0 CHECK (win >= 0),
  loss         INTEGER NOT NULL DEFAULT 0 CHECK (loss >= 0),
  draw         INTEGER NOT NULL DEFAULT 0 CHECK (draw >= 0),
  created_at   TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at   TIMESTAMPTZ DEFAULT now() NOT NULL
);

ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "posts: authenticated read" ON posts
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "posts: own insert" ON posts
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "posts: own update" ON posts
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "posts: own delete" ON posts
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

DROP TRIGGER IF EXISTS posts_updated_at ON posts;
CREATE TRIGGER posts_updated_at
  BEFORE UPDATE ON posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE INDEX IF NOT EXISTS posts_user_id_idx    ON posts(user_id);
CREATE INDEX IF NOT EXISTS posts_faction_id_idx ON posts(faction_id);
CREATE INDEX IF NOT EXISTS posts_created_at_idx ON posts(created_at DESC);


-- =============================================
-- 4. comments（コメント・使ってみた報告）
-- =============================================
CREATE TABLE IF NOT EXISTS comments (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id             UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id             UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  parent_id           UUID REFERENCES comments(id) ON DELETE CASCADE,
  type                TEXT NOT NULL DEFAULT 'comment' CHECK (type IN ('comment', 'used')),
  body                TEXT,
  photo_url           TEXT,
  result              TEXT CHECK (result IN ('win', 'loss', 'draw')),
  opponent_faction_id UUID REFERENCES factions(id),
  created_at          TIMESTAMPTZ DEFAULT now() NOT NULL
);

ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "comments: authenticated read" ON comments
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "comments: own insert" ON comments
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "comments: own update" ON comments
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "comments: own delete" ON comments
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS comments_post_id_idx ON comments(post_id);


-- =============================================
-- 5. likes（いいね）
-- =============================================
CREATE TABLE IF NOT EXISTS likes (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id    UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id    UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE (post_id, user_id)
);

ALTER TABLE likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "likes: authenticated read" ON likes
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "likes: own insert" ON likes
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "likes: own delete" ON likes
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS likes_post_id_idx ON likes(post_id);


-- =============================================
-- 6. follows（フォロー）
-- =============================================
CREATE TABLE IF NOT EXISTS follows (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id  UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at   TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE (follower_id, following_id),
  CHECK (follower_id != following_id)
);

ALTER TABLE follows ENABLE ROW LEVEL SECURITY;

CREATE POLICY "follows: authenticated read" ON follows
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "follows: own insert" ON follows
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "follows: own delete" ON follows
  FOR DELETE TO authenticated USING (auth.uid() = follower_id);

CREATE INDEX IF NOT EXISTS follows_following_id_idx ON follows(following_id);
CREATE INDEX IF NOT EXISTS follows_follower_id_idx  ON follows(follower_id);


-- =============================================
-- 7. notifications（通知）
-- =============================================
CREATE TABLE IF NOT EXISTS notifications (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type       TEXT NOT NULL CHECK (type IN ('like', 'comment', 'follow')),
  actor_id   UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  post_id    UUID REFERENCES posts(id) ON DELETE CASCADE,
  comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  read       BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- 自分の通知のみ閲覧・更新可
CREATE POLICY "notifications: own read" ON notifications
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "notifications: own update" ON notifications
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- 通知の INSERT は service role（Server Action）から行う
CREATE POLICY "notifications: service role insert" ON notifications
  FOR INSERT TO service_role WITH CHECK (true);

CREATE INDEX IF NOT EXISTS notifications_user_id_idx ON notifications(user_id, read, created_at DESC);


-- =============================================
-- 完了メッセージ
-- =============================================
DO $$
BEGIN
  RAISE NOTICE 'Roster Vox schema created successfully!';
END $$;
