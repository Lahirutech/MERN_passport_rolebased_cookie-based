const { body } = require('express-validator');

module.exports = {
    registerSchema: [
        body('email').trim()
        .isEmail().withMessage('email must contain a valid email address').normalizeEmail().toLowerCase(),
        body('password')
        .isLength({ min: 5 })
        .withMessage('password must be at least 5 characters long'),
    ]
}