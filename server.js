const express = require("express");
const morgan = require("morgan")
const bodyParser = require("body-parser")
const createHttpError = require('http-errors');
const mongoose = require("mongoose")
const session = require('express-session');
const connectFlash = require('connect-flash');
const passport = require('passport')
const connectMongo = require('connect-mongo');
const { ensureLoggedIn } = require('connect-ensure-login');
const { roles } = require("./utils/constants");
const { ensureAdmin } = require("./utils/permissions");


const app = express();
const cors = require("cors");
require("dotenv").config({ path: "./config.env" });
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Init Session
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60 * 60 * 24 * 1000 },
    store: connectMongo.create({
        mongoUrl: process.env.ATLAS_URI
    })
}));
//for passport js authentication
app.use(passport.initialize())
app.use(passport.session())
require('./utils/passport.auth')
app.use(connectFlash())
    //middleware
app.use(morgan('dev'))

//Routes
app.use('/auth', require('./routes/auth'))
app.use('/user', ensureLoggedIn({ redirectTo: '/auth/login' }), require('./routes/user'))
app.use('/admin', ensureLoggedIn({ redirectTo: '/auth/login' }), async(req, res, next) => {
        ensureAdmin(req, res, next);
    },
    require('./routes/admin.route'))
app.use('/', require('./routes/index.route'));



// 404 Handler
app.use((req, res, next) => {
    next(createHttpError.NotFound());
});

// Error Handler
app.use((error, req, res, next) => {
    error.status = error.status || 500;
    res.status(error.status);
    res.send(error)
});

app.use((req, res, next) => {
    res.locals.user = req.user
    next()
})
mongoose
    .connect(process.env.ATLAS_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,

    })
    .then(() => console.log("db Connected"));

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// function ensureAuthenticated(req, res, next) {
//     console.log("check authenticated", req.isAuthenticated())
//     if (req.isAuthenticated()) {
//         next()
//     } else {
//         res.redirect('/auth/login')
//     }
// }

// function ensureAdmin(req, res, next) {
//     console.log("check authenticated", req.isAuthenticated())
//     if (req.user.role === roles.admin) {
//         next()
//     } else {
//         res.redirect('/auth/login')
//     }
// }


function ensureModerator(req, res, next) {
    if (req.user.role === roles.moderator) {
        next();
    } else {
        //req.flash('warning', 'you are not Authorized to see this route');
        res.redirect('/');
    }
}