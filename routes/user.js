const router = require('express').Router();

const UsersController = require('../controllers/users');
const User = require('../models/user.model');

router.get('/profile', async(req, res, next) => {
    console.log("req.user", req.user)
    res.send("LogProfilein")
})

router.get('/register', async(req, res, next) => {
    res.send("Login")
})

router.post('/register', async(req, res, next) => {
    try {
        const { email } = req.body;
        const doesExist = await User.findOne({ email });
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