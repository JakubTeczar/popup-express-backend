-- Get all users
-- name: getAllUsers
SELECT id, name, email, created_at, updated_at FROM users;

-- Get user by ID
-- name: getUserById
SELECT id, name, email, token, created_at, updated_at FROM users WHERE id = $1;

-- Create new user
-- name: createUser
INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email, created_at, updated_at;

-- Update user
-- name: updateUser
UPDATE users SET name = $1, email = $2, password = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING id, name, email, created_at, updated_at;

-- Delete user
-- name: deleteUser
DELETE FROM users WHERE id = $1 RETURNING id, name, email;

-- Login user
-- name: loginUser
SELECT id, name, email, password, token FROM users WHERE email = $1;

-- Clear user token (logout)
-- name: logoutUser
UPDATE users SET updated_at = CURRENT_TIMESTAMP, token = NULL WHERE id = $1;

-- Generate access and secret keys for user
-- name: generateUserKeys
UPDATE users SET access_key = $1, secret_key = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING id, name, email, access_key, secret_key, created_at, updated_at;

-- Get user by access key for validation
-- name: getUserByAccessKey
SELECT id, name, email, access_key, secret_key FROM users WHERE access_key = $1;

-- Get user keys
-- name: getUserKeys
SELECT access_key, secret_key FROM users WHERE id = $1;

-- Update user token (for login/register)
-- name: updateUserToken
UPDATE users SET token = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING id, name, email, token, created_at, updated_at;