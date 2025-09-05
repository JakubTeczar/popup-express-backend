import { getAllUsersService, createUserService, getUserByIdService, updateUserService, deleteUserService, loginUserService, logoutUserService } from '../models/userModel.js'
import jwt from 'jsonwebtoken'
import { config } from '../config/config.js'

// Standard CRUD responses
const handleResponse = (res, statusCode, message, data) => {
    res.status(statusCode).json({
        status: statusCode,
        message,
        data
    })
}

export const getAllUsers = async (req, res, next) => {
    try {
        const users = await getAllUsersService()
        if (!users.length) {
            return handleResponse(res, 404, 'No users found', [])
        }
        handleResponse(res, 200, 'Users fetched successfully', users)
    } catch (error) {
        next(error)
    }
}

export const getUserById = async (req, res, next) => {
    const { id } = req.params
    try {
        const user = await getUserByIdService(id)
        handleResponse(res, 200, 'User fetched successfully', user)
    } catch (error) {
        next(error)
    }
}

export const updateUser = async (req, res, next) => {
    const { id } = req.params
    const { name, email, password } = req.body
    try {
        const updatedUser = await updateUserService(id, { name, email, password })
        handleResponse(res, 200, 'User updated successfully', updatedUser)
    } catch (error) {
        next(error)
    }
}

export const deleteUser = async (req, res, next) => {

    const { id } = req.params
    try {
        await deleteUserService(id)
        handleResponse(res, 200, 'User deleted successfully', null)
    } catch (error) {
        next(error)
    }
}

export const createUser = async (req, res, next) => {
    const { name, email, password } = req.body
    try {
        const newUser = await createUserService({ name, email, password })
        handleResponse(res, 201, 'User created successfully', newUser)
    } catch (error) {
        next(error)
    }
}

export const registerUser = async (req, res, next) => {
    const { name, email, password } = req.body
    try {
        const newUser = await createUserService({ name, email, password })
        const token = jwt.sign({ id: newUser.id }, config.jwt.secret, { expiresIn: config.jwt.expiresIn })
        const userWithToken = { ...newUser, token }

        handleResponse(res, 201, 'User created successfully', userWithToken)
    } catch (error) {
        next(error)
    }
}

export const loginUser = async (req, res, next) => {
    const { email, password } = req.body
    try {
        const user = await loginUserService(email, password)
        const token = jwt.sign({ id: user.id }, config.jwt.secret, { expiresIn: config.jwt.expiresIn })

        handleResponse(res, 200, 'User logged in successfully', { user, token })
    } catch (error) {
        next(error)
    }
}

export const logoutUser = async (req, res, next) => {
    const { id } = req.params
    try {
        await logoutUserService(id)
        handleResponse(res, 200, 'User logged out successfully', null)
    } catch (error) {
        next(error)
    }
}