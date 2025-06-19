CREATE TABLE test (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL 
);

------
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE registered_users (
    id_registered_user UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    nickname VARCHAR(100) UNIQUE NOT NULL,
    last_login TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL
);

CREATE TABLE passwords (
    id_registered_user INTEGER PRIMARY KEY REFERENCES registered_users(id_registered_user) ON DELETE CASCADE,
    password TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

SELECT cron.schedule(
	'remove_old_users', '0 0 * * *',
	$$ DELETE FROM users WHERE expires_at < NOW() - INTERVAL '3 months'; $$
);

SELECT cron.schedule(
	'remove_old_rooms', '0 0 * * *',
	$$ DELETE FROM rooms WHERE expires_at < NOW() - INTERVAL '3 months'; $$
);