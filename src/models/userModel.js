import pool from '../config/db.js'
import { loadNamedQueries } from '../utils/sqlLoader.js'

// Load all user queries once
const queries = loadNamedQueries('userQueries')

export const getAllUsersService = async () => {
    const result = await pool.query(queries.getAllUsers)
    return result.rows
}

export const getUserByIdService = async (id) => {
    const result = await pool.query(queries.getUserById, [id])
    return result.rows[0]
}

export const createUserService = async (user) => {
    const { name, email, password } = user
    const result = await pool.query(queries.createUser, [name, email, password])
    return result.rows[0]
}

export const updateUserService = async (id, user) => {
    const { name, email, password } = user
    const result = await pool.query(queries.updateUser, [name, email, password, id])
    return result.rows[0]
}

export const deleteUserService = async (id) => {
    const result = await pool.query(queries.deleteUser, [id])
    return result.rows[0]
}

export const loginUserService = async (email, password) => {
    const result = await pool.query(queries.loginUser, [email])
    if (result.rows.length === 0) {
        throw new Error('Invalid email or password')
    }
    
    const user = result.rows[0]
    // Here you should compare hashed passwords in production
    if (user.password !== password) {
        throw new Error('Invalid email or password')
    }
    
    return user
}

export const logoutUserService = async (id) => {
    const result = await pool.query(queries.logoutUser, [id])
    return result.rows[0]
}
