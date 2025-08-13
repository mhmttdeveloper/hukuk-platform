-- Hukuk Platformu Veritabanı Başlangıç
CREATE DATABASE hukuk_platformu;
\c hukuk_platformu;

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Kullanıcı yetkileri
GRANT ALL PRIVILEGES ON DATABASE hukuk_platformu TO hukuk_user;
GRANT ALL PRIVILEGES ON SCHEMA public TO hukuk_user;
