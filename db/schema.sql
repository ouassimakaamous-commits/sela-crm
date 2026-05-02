CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS formateurs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nom VARCHAR(100),
  prenom VARCHAR(100),
  specialite VARCHAR(100),
  email VARCHAR(150),
  telephone VARCHAR(20),
  statut VARCHAR(20) DEFAULT 'actif',
  quota_hs_mensuel INTEGER DEFAULT 40,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS apprenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nom VARCHAR(100),
  prenom VARCHAR(100),
  email VARCHAR(150),
  telephone VARCHAR(20),
  date_naissance DATE,
  filiere VARCHAR(100),
  financement VARCHAR(50),
  statut VARCHAR(30) DEFAULT 'inscrit',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  intitule VARCHAR(200),
  formateur_id UUID REFERENCES formateurs(id),
  date_debut DATE,
  date_fin DATE,
  nb_places INTEGER,
  nb_inscrits INTEGER DEFAULT 0,
  salle VARCHAR(50),
  statut VARCHAR(30) DEFAULT 'planifiee',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS heures_sup (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  formateur_id UUID REFERENCES formateurs(id),
  session_id UUID REFERENCES sessions(id),
  date_hs DATE,
  type_hs VARCHAR(10),
  nb_heures DECIMAL(5,2),
  taux_horaire DECIMAL(8,2),
  majoration_pct INTEGER DEFAULT 0,
  montant_final DECIMAL(10,2),
  statut VARCHAR(20) DEFAULT 'en_attente',
  valide_par VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS finances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  libelle VARCHAR(200),
  categorie VARCHAR(50),
  montant DECIMAL(10,2),
  type VARCHAR(10),
  date_transaction DATE,
  created_at TIMESTAMP DEFAULT NOW()
);
