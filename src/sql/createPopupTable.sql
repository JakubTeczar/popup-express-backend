-- Create popup table
CREATE TABLE IF NOT EXISTS popup (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    template_id INT NOT NULL,
    user_id INT NOT NULL,
    popup_config TEXT,
    website_url VARCHAR(255) NOT NULL,
    content JSONB NOT NULL,
    exported_html TEXT NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    share_id VARCHAR(255) NOT NULL UNIQUE,
    images JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);