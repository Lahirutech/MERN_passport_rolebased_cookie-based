const router = require('express').Router();

const UsersController = require('../controllers/users');
const User = require('../models/user.model');
const { body, validationResult } = require('express-validator');
const { registerSchema } = require('../schema/register-schema');
const validateRequestSchema = require('../middleware/validate-request-schema');
const passport = require('passport')

router.get('/login', async(req, res, next) => {
    res.send("Login")
})
router.post('/login', passport.authenticate('local', {
    successRedirect: '/user/profile',
    failureRedirect: '/auth/login'
}))

router.get('/register', async(req, res, next) => {
    res.send("register")
})
router.post('/register', registerSchema,
    async(req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                errors.array().forEach((error) => {
                    console.log('error', error.msg);
                });
                return res.status(400).json({ errors: errors.array() });
            }
            const { email } = req.body;
            const doesExist = await User.findOne({ email });
            console.log("doesExist", doesExist)
            if (doesExist) {
                req.flash('warning', 'Username/email already exists');
                res.redirect('/auth/register');
                return;
            }
            const user = new User(req.body);
            await user.save();
            req.flash(
                'success',
                `${user.email} registered succesfully, you can now login`
            );
            res.redirect('/auth/login');

        } catch (error) {
            console.log("Error", error)
            next(error)
        }
    })


router.post('/login', async(req, res, next) => {
    res.send("Login")
})



module.exports = router