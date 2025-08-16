-- YargıTam Veritabanı Başlangıç
CREATE DATABASE yargitam;
\c yargitam;

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Kullanıcı yetkileri
GRANT ALL PRIVILEGES ON DATABASE yargitam TO hukuk_user;
GRANT ALL PRIVILEGES ON SCHEMA public TO hukuk_user;
