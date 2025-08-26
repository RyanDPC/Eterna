-- ===== INITIALISATION BASE DE DONNÉES ETERNA =====
-- Script SQL pour créer la structure de la base de données

-- Créer la base de données si elle n'existe pas
-- CREATE DATABASE eterna;

-- Utiliser la base de données
-- \c eterna;

-- Extension pour les UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ===== TABLE UTILISATEURS =====
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE,
    password_hash VARCHAR(255), -- Hash du mot de passe pour auth email/password
    avatar_url TEXT,
    provider VARCHAR(20) DEFAULT 'local', -- 'local', 'google', 'steam'
    provider_id VARCHAR(255), -- ID externe du provider
    status VARCHAR(20) DEFAULT 'online', -- 'online', 'away', 'dnd', 'offline'
    last_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===== TABLE SERVEURS =====
CREATE TABLE IF NOT EXISTS servers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    is_public BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===== TABLE MEMBRES DES SERVEURS =====
CREATE TABLE IF NOT EXISTS server_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    server_id UUID NOT NULL REFERENCES servers(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(20) DEFAULT 'member', -- 'owner', 'admin', 'member'
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(server_id, user_id)
);

-- ===== TABLE CHANNELS =====
CREATE TABLE IF NOT EXISTS channels (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    type VARCHAR(20) NOT NULL, -- 'text', 'voice'
    server_id UUID NOT NULL REFERENCES servers(id) ON DELETE CASCADE,
    is_fixed BOOLEAN DEFAULT false, -- Channel fixe (comme "Général")
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(server_id, name)
);

-- ===== TABLE MESSAGES =====
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content TEXT NOT NULL,
    author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    channel_id UUID NOT NULL REFERENCES channels(id) ON DELETE CASCADE,
    reply_to_id UUID REFERENCES messages(id) ON DELETE SET NULL,
    is_pinned BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===== TABLE PARTICIPANTS DES CHANNELS VOCAUX =====
CREATE TABLE IF NOT EXISTS voice_participants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    channel_id UUID NOT NULL REFERENCES channels(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(channel_id, user_id)
);

-- ===== INDEX POUR LES PERFORMANCES =====

-- Index sur les utilisateurs
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_provider ON users(provider);

-- Index sur les serveurs
CREATE INDEX IF NOT EXISTS idx_servers_owner ON servers(owner_id);
CREATE INDEX IF NOT EXISTS idx_servers_public ON servers(is_public);

-- Index sur les membres des serveurs
CREATE INDEX IF NOT EXISTS idx_server_members_server ON server_members(server_id);
CREATE INDEX IF NOT EXISTS idx_server_members_user ON server_members(user_id);
CREATE INDEX IF NOT EXISTS idx_server_members_role ON server_members(role);

-- Index sur les channels
CREATE INDEX IF NOT EXISTS idx_channels_server ON channels(server_id);
CREATE INDEX IF NOT EXISTS idx_channels_type ON channels(type);
CREATE INDEX IF NOT EXISTS idx_channels_fixed ON channels(is_fixed);

-- Index sur les messages
CREATE INDEX IF NOT EXISTS idx_messages_channel ON messages(channel_id);
CREATE INDEX IF NOT EXISTS idx_messages_author ON messages(author_id);
CREATE INDEX IF NOT EXISTS idx_messages_created ON messages(created_at);
CREATE INDEX IF NOT EXISTS idx_messages_reply ON messages(reply_to_id);
CREATE INDEX IF NOT EXISTS idx_messages_pinned ON messages(is_pinned);

-- Index sur les participants vocaux
CREATE INDEX IF NOT EXISTS idx_voice_participants_channel ON voice_participants(channel_id);
CREATE INDEX IF NOT EXISTS idx_voice_participants_user ON voice_participants(user_id);

-- ===== TRIGGERS POUR MISE À JOUR AUTOMATIQUE =====

-- Fonction pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers pour updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_servers_updated_at BEFORE UPDATE ON servers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_channels_updated_at BEFORE UPDATE ON channels
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_messages_updated_at BEFORE UPDATE ON messages
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ===== VUES UTILES =====

-- Vue pour les serveurs avec compteurs
CREATE OR REPLACE VIEW server_stats AS
SELECT 
    s.id,
    s.name,
    s.description,
    s.owner_id,
    s.is_public,
    s.created_at,
    COUNT(DISTINCT sm.user_id) as member_count,
    COUNT(DISTINCT CASE WHEN c.type = 'voice' THEN c.id END) as voice_channels_count,
    COUNT(DISTINCT CASE WHEN c.type = 'text' THEN c.id END) as text_channels_count
FROM servers s
LEFT JOIN server_members sm ON s.id = sm.server_id
LEFT JOIN channels c ON s.id = c.server_id
GROUP BY s.id, s.name, s.description, s.owner_id, s.is_public, s.created_at;

-- Vue pour les channels avec compteurs
CREATE OR REPLACE VIEW channel_stats AS
SELECT 
    c.id,
    c.name,
    c.description,
    c.type,
    c.server_id,
    c.is_fixed,
    c.created_at,
    COUNT(DISTINCT m.id) as message_count,
    COUNT(DISTINCT vp.user_id) as participant_count,
    MAX(m.created_at) as last_message_at
FROM channels c
LEFT JOIN messages m ON c.id = m.channel_id
LEFT JOIN voice_participants vp ON c.id = vp.channel_id
GROUP BY c.id, c.name, c.description, c.type, c.server_id, c.is_fixed, c.created_at;

-- ===== DONNÉES INITIALES =====

-- Insérer un utilisateur de test (optionnel)
-- INSERT INTO users (username, email, provider, provider_id) 
-- VALUES ('admin', 'admin@eterna.app', 'local', 'admin') 
-- ON CONFLICT (username) DO NOTHING;

-- ===== FONCTIONS UTILITAIRES =====

-- Fonction pour nettoyer les channels vocaux vides
CREATE OR REPLACE FUNCTION cleanup_empty_voice_channels()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER := 0;
BEGIN
    DELETE FROM channels 
    WHERE type = 'voice' 
    AND is_fixed = false 
    AND id NOT IN (
        SELECT DISTINCT channel_id 
        FROM voice_participants
    );
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour obtenir les statistiques d'un utilisateur
CREATE OR REPLACE FUNCTION get_user_stats(user_uuid UUID)
RETURNS TABLE(
    messages_sent BIGINT,
    servers_owned BIGINT,
    servers_joined BIGINT,
    channels_created BIGINT,
    last_activity TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(DISTINCT m.id)::BIGINT as messages_sent,
        COUNT(DISTINCT CASE WHEN s.owner_id = user_uuid THEN s.id END)::BIGINT as servers_owned,
        COUNT(DISTINCT sm.server_id)::BIGINT as servers_joined,
        COUNT(DISTINCT c.id)::BIGINT as channels_created,
        GREATEST(MAX(m.created_at), MAX(s.created_at)) as last_activity
    FROM users u
    LEFT JOIN messages m ON u.id = m.author_id
    LEFT JOIN servers s ON u.id = s.owner_id
    LEFT JOIN server_members sm ON u.id = sm.user_id
    LEFT JOIN channels c ON s.id = c.server_id
    WHERE u.id = user_uuid;
END;
$$ LANGUAGE plpgsql;

-- ===== COMMENTAIRES =====

COMMENT ON TABLE users IS 'Table des utilisateurs de l''application Eterna';
COMMENT ON TABLE servers IS 'Table des serveurs communautaires';
COMMENT ON TABLE server_members IS 'Table de liaison entre utilisateurs et serveurs';
COMMENT ON TABLE channels IS 'Table des channels (textuels et vocaux)';
COMMENT ON TABLE messages IS 'Table des messages échangés';
COMMENT ON TABLE voice_participants IS 'Table des participants aux channels vocaux';

COMMENT ON COLUMN channels.is_fixed IS 'Indique si le channel est fixe (comme "Général") et ne peut pas être supprimé';
COMMENT ON COLUMN server_members.role IS 'Rôle de l''utilisateur dans le serveur (owner, admin, member)';
COMMENT ON COLUMN messages.reply_to_id IS 'Référence vers le message auquel on répond';

-- ===== FIN DU SCRIPT =====

