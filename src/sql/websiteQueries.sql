-- name: getAllWebsites
SELECT * FROM websites ORDER BY created_at DESC;

-- name: getWebsiteById
SELECT * FROM websites WHERE ID = $1;

-- name: getWebsitesByUserId
SELECT * FROM websites WHERE user_id = $1 ORDER BY created_at DESC;

-- name: getWebsiteByPageId
SELECT * FROM websites WHERE page_id = $1;

-- name: createWebsite
INSERT INTO websites (user_id, url, title, page_id) VALUES ($1, $2, $3, $4) RETURNING *;

-- name: updateWebsite
UPDATE websites SET url = $2, title = $3, page_id = $4, updated_at = CURRENT_TIMESTAMP WHERE ID = $1 RETURNING *;

-- name: deleteWebsite
DELETE FROM websites WHERE ID = $1 RETURNING *;

-- name: deleteWebsitesByUserId
DELETE FROM websites WHERE user_id = $1;

-- name: checkWebsiteExists
SELECT COUNT(*) FROM websites WHERE page_id = $1 AND user_id = $2;

-- name: getWebsiteByPageIdAndUserId
SELECT * FROM websites WHERE page_id = $1 AND user_id = $2;
