-- ContentProof — Neon PostgreSQL Schema
-- Run this in your Neon project's SQL editor

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Registered proofs (each verified file)
CREATE TABLE IF NOT EXISTS proofs (
  id               UUID          DEFAULT gen_random_uuid() PRIMARY KEY,
  clerk_user_id    TEXT          NOT NULL,
  user_email       TEXT,
  user_name        TEXT,

  -- File info
  file_name        TEXT          NOT NULL,
  file_size        BIGINT        NOT NULL,
  file_type        TEXT          NOT NULL,

  -- Hashing
  sha256_hash      TEXT          NOT NULL UNIQUE,

  -- Metadata
  title            TEXT,
  description      TEXT,
  tags             TEXT[]        DEFAULT '{}',

  -- Visibility
  is_public        BOOLEAN       DEFAULT TRUE,

  -- Timestamps
  registered_at    TIMESTAMPTZ   DEFAULT NOW(),
  expires_at       TIMESTAMPTZ,

  -- Short public ID for proof URLs
  short_id         TEXT          UNIQUE DEFAULT SUBSTRING(MD5(RANDOM()::TEXT), 1, 8)
);

-- Verification log (anonymous, who checked what)
CREATE TABLE IF NOT EXISTS verifications (
  id               UUID          DEFAULT gen_random_uuid() PRIMARY KEY,
  proof_id         UUID          REFERENCES proofs(id) ON DELETE SET NULL,

  submitted_hash   TEXT          NOT NULL,
  result           TEXT          NOT NULL CHECK (result IN ('match', 'mismatch', 'not_found')),

  verified_at      TIMESTAMPTZ   DEFAULT NOW()
);

-- Indexes for fast lookups
CREATE INDEX IF NOT EXISTS proofs_sha256_hash_idx   ON proofs(sha256_hash);
CREATE INDEX IF NOT EXISTS proofs_short_id_idx      ON proofs(short_id);
CREATE INDEX IF NOT EXISTS proofs_clerk_user_id_idx ON proofs(clerk_user_id);
CREATE INDEX IF NOT EXISTS verifications_proof_id_idx ON verifications(proof_id);
