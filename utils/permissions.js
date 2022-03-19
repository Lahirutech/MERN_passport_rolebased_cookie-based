const { roles } = require("./constants");

const ensureAdmin = (req, res, next) => {
    if (req.user.role === roles.admin) {
        next()
    } else {
        res.redirect('/auth/login')
    }
}


const ensureModerator = (req, res, next) => {
    if (req.user.role === roles.moderator) {
        next();
    } else {
        //req.flash('warning', 'you are not Authorized to see this route');
        res.redirect('/');
    }
}
module.exports = {
    ensureAdmin,
    ensureModerator
}