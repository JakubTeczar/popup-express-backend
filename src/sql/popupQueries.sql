-- Check if share_id already exists
-- name: checkShareId
SELECT * FROM popup WHERE share_id = $1;

-- Create popup
-- name: createPopup
INSERT INTO popup (user_id, name, template_id, popup_config, content, exported_html, active, share_id, website_url, images) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *;

-- Get popup by share_id
-- name: getPopup
SELECT * FROM popup WHERE share_id = $1;

-- Update popup
-- name: updatePopup
UPDATE popup SET name = $2, template_id = $3, popup_config = $4, content = $5, exported_html = $6, active = $7, website_url = $8, images = $9 WHERE share_id = $1 RETURNING *;

-- Delete popup
-- name: deletePopup
DELETE FROM popup WHERE share_id = $1 RETURNING *;

-- Get all user popups
-- name: getAllUserPopups
SELECT * FROM popup WHERE user_id = $1;