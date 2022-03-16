const { validationResult } = require('express-validator');

module.exports = function() {
    console.log("got a hit", req)
    const errors = validationResult(req);
    console.log("got a hit", errors)
    if (!errors.isEmpty()) {
        console.log("Errors", errors)
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}