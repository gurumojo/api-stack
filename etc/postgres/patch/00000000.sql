CREATE SCHEMA api;

CREATE TYPE api.client AS ENUM (
	'android'
	'blackberry'
	'ios'
	'linux'
	'mac'
	'windows'
);

CREATE FUNCTION api.updated()
	RETURNS TRIGGER
	LANGUAGE plpgsql AS $$
	BEGIN
		NEW.updated := now();
		RETURN NEW;
	END;
$$;

CREATE TABLE api.user (
	id      UUID UNIQUE NOT NULL,
	email   TEXT NOT NULL,
	phone   TEXT NOT NULL CHECK (phone ~ '^[\d]+$'),
	given   TEXT,
	middle  TEXT,
	family  TEXT,
	handle  TEXT,
	birth   DATE,
	created TIMESTAMPTZ DEFAULT NOW(),
	updated TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE api.group (
	id          UUID UNIQUE NOT NULL,
	name        TEXT NOT NULL,
	description TEXT,
	created     TIMESTAMPTZ DEFAULT NOW(),
	updated     TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE api.alias (
	id      UUID UNIQUE NOT NULL,
	email   TEXT NOT NULL,
	phone   TEXT NOT NULL CHECK (phone ~ '^[\d]+$'),
	given   TEXT,
	middle  TEXT,
	family  TEXT,
	handle  TEXT,
	birth   DATE,
	created TIMESTAMPTZ DEFAULT NOW(),
	updated TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE api.device (
	id         SERIAL PRIMARY KEY,
	user_id    UUID NOT NULL,
	platform   api.client NOT NULL,
	key        TEXT NOT NULL,
	token      TEXT,
	created    TIMESTAMPTZ DEFAULT NOW(),
	updated    TIMESTAMPTZ DEFAULT NOW(),
	CONSTRAINT device_user_id_fk FOREIGN KEY (user_id) REFERENCES api.user (id) ON DELETE CASCADE
);

CREATE TABLE api.membership (
	id         SERIAL PRIMARY KEY,
	user_id    UUID NOT NULL,
	group_id   UUID NOT NULL,
	alias_id   UUID,
	created    TIMESTAMPTZ DEFAULT NOW(),
	updated    TIMESTAMPTZ DEFAULT NOW(),
	CONSTRAINT membership_user_id_fk FOREIGN KEY (user_id) REFERENCES api.user (id) ON DELETE CASCADE,
	CONSTRAINT membership_group_id_fk FOREIGN KEY (group_id) REFERENCES api.group (id) ON DELETE CASCADE
);

CREATE TRIGGER user_update
	BEFORE UPDATE ON api.user
	FOR EACH ROW
	EXECUTE PROCEDURE api.updated();

CREATE TRIGGER group_update
	BEFORE UPDATE ON api.group
	FOR EACH ROW
	EXECUTE PROCEDURE api.updated();

CREATE TRIGGER alias_update
	BEFORE UPDATE ON api.alias
	FOR EACH ROW
	EXECUTE PROCEDURE api.updated();

CREATE TRIGGER device_update
	BEFORE UPDATE ON api.device
	FOR EACH ROW
	EXECUTE PROCEDURE api.updated();

CREATE TRIGGER membership_update
	BEFORE UPDATE ON api.membership
	FOR EACH ROW
	EXECUTE PROCEDURE api.updated();

CREATE ROLE api_anon NOLOGIN;
GRANT api_anon TO current_user;
GRANT USAGE ON SCHEMA api TO api_anon;
GRANT SELECT ON api.user TO api_anon;
GRANT SELECT ON api.group TO api_anon;
GRANT SELECT ON api.alias TO api_anon;
GRANT SELECT ON api.device TO api_anon;
GRANT SELECT ON api.membership TO api_anon;

CREATE ROLE api_auth NOLOGIN;
GRANT api_auth TO current_user;
GRANT USAGE ON SCHEMA api TO api_auth;
GRANT ALL ON api.user TO api_auth;
GRANT ALL ON api.group TO api_auth;
GRANT ALL ON api.alias TO api_auth;
GRANT ALL ON api.device TO api_auth;
GRANT ALL ON api.membership TO api_auth;
GRANT USAGE, SELECT ON SEQUENCE api.device_id_seq TO api_auth;
GRANT USAGE, SELECT ON SEQUENCE api.membership_id_seq TO api_auth;
