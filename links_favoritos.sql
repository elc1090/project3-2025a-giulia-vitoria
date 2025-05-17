CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL
);

CREATE TABLE bookmarks (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    titulo TEXT NOT NULL,
    url TEXT NOT NULL,
    descricao TEXT,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Adiciona coluna user_id na tabela bookmarks, permitindo NULL por enquanto
ALTER TABLE bookmarks
ADD COLUMN user_id INTEGER REFERENCES users(id);

-- Se quiser garantir que user_id não seja nulo mais tarde:
-- ALTER TABLE bookmarks
-- ALTER COLUMN user_id SET NOT NULL;
