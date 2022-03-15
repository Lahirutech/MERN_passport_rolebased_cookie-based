const { validationResult } = require('express-validator');

module.exports = {
        validateRequestSchema() {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                console.log("Errors", errors)
                return res.status(400).json({ errors: errors.array() });
            }
            next();
        }
    }
    // export function validateRequestSchema() {
    //     const errors = validationResult(req);
    //     if (!errors.isEmpty()) {
    //         console.log("Errors", errors)
    //         return res.status(400).json({ errors: errors.array() });
    //     }
    //     next();
    // }