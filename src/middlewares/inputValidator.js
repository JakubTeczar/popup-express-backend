import Joi from 'joi'

const userSchema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required()
})

export const validateUser = async (req, res, next) => {
    const { error } = userSchema.validate(req.body)
    if (error) {
        return res.status(400).json({
            status: 400,
            message: error.details[0].message,
        })
    }
    next()
}