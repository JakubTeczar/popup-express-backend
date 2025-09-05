-- Upload new image
-- name: uploadImage
INSERT INTO images (user_id, original_name, file_name, file_path, file_url, file_size, mimetype) 
VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;

-- Get image by url
-- name: getImageByUrl
SELECT * FROM images WHERE file_url = $1;

-- Get image by id
-- name: getImageById
SELECT * FROM images WHERE id = $1;

-- Get all user images
-- name: getAllUserImages
SELECT * FROM images WHERE user_id = $1 ORDER BY created_at DESC;

-- Delete image
-- name: deleteImage
DELETE FROM images WHERE id = $1 AND user_id = $2 RETURNING *;