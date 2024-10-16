// middlewares/validationMiddleware.js
const { body,validationResult } = require('express-validator');

const userValidationRules = () => {
    return [
        body('username')
            .notEmpty().withMessage('Username is required')
            .isString().withMessage('Username must be a string')
            .isLength({ min: 3, max: 20 }).withMessage('Username must be between 3 and 20 characters.'),
        body('email')
            .notEmpty().withMessage('Email is required')
            .isEmail().withMessage('Please enter a valid email.')
            .normalizeEmail(),
        body('password')
            .notEmpty().withMessage('Password is required')
            .isLength({ min: 6 }).withMessage('Password must have at least 6 characters')
            .matches(/(?=.*[0-9])(?=.*[A-Z])(?=.*[!@#$%^&*])/).withMessage('Password must contain at least one number, one uppercase letter, and one special character'),
    ];
};

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

module.exports = { userValidationRules, validate };
