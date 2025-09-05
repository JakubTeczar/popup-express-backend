-- Get all users
-- name: getAllUsers
SELECT id, name, email, created_at, updated_at FROM users;

-- Get user by ID
-- name: getUserById
SELECT id, name, email, created_at, updated_at FROM users WHERE id = $1;

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
