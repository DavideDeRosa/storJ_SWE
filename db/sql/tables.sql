CREATE TABLE IF NOT EXISTS utente(
	id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(50) NOT NULL,
    statopagamento BOOLEAN NOT NULL
);