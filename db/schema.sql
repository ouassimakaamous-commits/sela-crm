-- Centre SELA CRM — Railway PostgreSQL Schema
-- Run this in your Railway console or via psql

-- ─── FORMATEURS ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS formateurs (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nom              VARCHAR(100) NOT NULL,
  prenom           VARCHAR(100),
  specialite       VARCHAR(100),
  email            VARCHAR(150) UNIQUE,
  telephone        VARCHAR(20),
  statut           VARCHAR(20)  DEFAULT 'actif',
  grade            VARCHAR(100),
  taux_horaire     DECIMAL(8,2) DEFAULT 100,
  quota_hs_mensuel INTEGER      DEFAULT 40,
  created_at       TIMESTAMP    DEFAULT NOW()
);

-- ─── APPRENANTS ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS apprenants (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nom             VARCHAR(100) NOT NULL,
  prenom          VARCHAR(100),
  email           VARCHAR(150) UNIQUE,
  telephone       VARCHAR(20),
  date_naissance  DATE,
  filiere         VARCHAR(100),
  financement     VARCHAR(50),
  statut          VARCHAR(30)  DEFAULT 'inscrit',
  created_at      TIMESTAMP    DEFAULT NOW()
);

-- ─── SESSIONS ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS sessions (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  intitule     VARCHAR(200) NOT NULL,
  formateur_id UUID         REFERENCES formateurs(id) ON DELETE SET NULL,
  date_debut   DATE,
  date_fin     DATE,
  nb_places    INTEGER      DEFAULT 15,
  nb_inscrits  INTEGER      DEFAULT 0,
  salle        VARCHAR(50),
  statut       VARCHAR(30)  DEFAULT 'planifiee',
  financement  VARCHAR(50),
  hs_generees  DECIMAL(5,2) DEFAULT 0,
  created_at   TIMESTAMP    DEFAULT NOW()
);

-- ─── INSCRIPTIONS (session ↔ apprenant) ────────────────────────────────────
CREATE TABLE IF NOT EXISTS inscriptions (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id   UUID REFERENCES sessions(id)   ON DELETE CASCADE,
  apprenant_id UUID REFERENCES apprenants(id) ON DELETE CASCADE,
  date_inscription TIMESTAMP DEFAULT NOW(),
  UNIQUE(session_id, apprenant_id)
);

-- ─── HEURES SUPPLÉMENTAIRES ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS heures_sup (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  formateur_id  UUID         REFERENCES formateurs(id) ON DELETE CASCADE,
  session_id    UUID         REFERENCES sessions(id)   ON DELETE SET NULL,
  date_hs       DATE         NOT NULL,
  type_hs       VARCHAR(10)  CHECK (type_hs IN ('HSA', 'HSE')),
  nb_heures     DECIMAL(5,2) NOT NULL,
  taux_horaire  DECIMAL(8,2) NOT NULL,
  majoration_pct INTEGER     DEFAULT 0,
  montant_brut  DECIMAL(10,2),
  montant_final DECIMAL(10,2),
  description   TEXT,
  statut        VARCHAR(20)  DEFAULT 'en_attente'
                             CHECK (statut IN ('en_attente', 'valide', 'refuse')),
  valide_par    VARCHAR(100),
  created_at    TIMESTAMP    DEFAULT NOW()
);

-- ─── FINANCES ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS finances (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  libelle          VARCHAR(200) NOT NULL,
  categorie        VARCHAR(50),
  montant          DECIMAL(10,2) NOT NULL,
  type             VARCHAR(10)  CHECK (type IN ('Recette', 'Dépense')),
  date_transaction DATE,
  created_at       TIMESTAMP DEFAULT NOW()
);

-- ─── INDEXES ───────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_heures_sup_formateur ON heures_sup(formateur_id);
CREATE INDEX IF NOT EXISTS idx_heures_sup_statut    ON heures_sup(statut);
CREATE INDEX IF NOT EXISTS idx_sessions_formateur   ON sessions(formateur_id);
CREATE INDEX IF NOT EXISTS idx_sessions_statut      ON sessions(statut);
CREATE INDEX IF NOT EXISTS idx_inscriptions_session ON inscriptions(session_id);
CREATE INDEX IF NOT EXISTS idx_finances_date        ON finances(date_transaction);
