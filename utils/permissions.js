const { roles } = require("./constants");

const ensureAdmin = (req, res, next) => {
    if (req.user.role === roles.admin) {
        next()
    } else {
        res.redirect('/auth/login')
    }
}
module.exports = {
    ensureAdmin
}