CREATE TABLE IF NOT EXISTS users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email         TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role          TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  created_at    TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS items (
  id          UUID PRIMARY KEY,
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type        TEXT NOT NULL,
  url         TEXT NOT NULL,
  title       TEXT NOT NULL,
  thumbnail   TEXT,
  description TEXT,
  domain      TEXT NOT NULL,
  author      TEXT,
  date_added  TIMESTAMPTZ NOT NULL DEFAULT now(),
  tags        TEXT[] DEFAULT '{}',
  UNIQUE(user_id, url)
);

CREATE INDEX IF NOT EXISTS idx_items_user_id ON items(user_id);
CREATE INDEX IF NOT EXISTS idx_items_type    ON items(type);

CREATE TABLE IF NOT EXISTS categories (
  slug         TEXT NOT NULL,
  user_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  label        TEXT NOT NULL,
  plural_label TEXT NOT NULL,
  icon_name    TEXT NOT NULL,
  accent_color TEXT NOT NULL,
  tile_variant TEXT NOT NULL DEFAULT 'landscape',
  built_in     BOOLEAN NOT NULL DEFAULT false,
  "order"      INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (slug, user_id)
);

CREATE INDEX IF NOT EXISTS idx_categories_user_id ON categories(user_id);
