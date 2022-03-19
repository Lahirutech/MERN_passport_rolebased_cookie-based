const { default: mongoose } = require('mongoose');
const User = require('../models/user.model')
const router = require('express').Router()

router.get('/users', async(req, res, next) => {
    try {
        const users = await User.find();
        res.send(users)
    } catch (error) {
        next(error)
    }
})

router.get('/user/:id', async(req, res, next) => {
    try {
        const { id } = req.params
        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.redirect('/')
            return
        }
        const person = await User.findById(id)
        res.send(person)
    } catch (error) {
        next(error)

    }
})















module.exports = router