-- create user 'keycloak' if missing
DO
$do$
BEGIN
   IF NOT EXISTS (
      SELECT FROM pg_catalog.pg_user
      WHERE usename = 'keycloak') THEN
      CREATE USER keycloak WITH PASSWORD 'keycloak';
   END IF;
END
$do$;

-- create database 'keycloak' if missing
SELECT 'CREATE DATABASE keycloak OWNER keycloak'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'keycloak')\gexec

-- set permissions for keycloak database
GRANT ALL PRIVILEGES ON DATABASE keycloak TO keycloak;

-- set permissions for n8n database
GRANT ALL PRIVILEGES ON DATABASE n8n TO keycloak;