const express = require("express");
const morgan = require("morgan")
const bodyParser = require("body-parser")
const createHttpError = require('http-errors');
const mongoose = require("mongoose")
const session = require('express-session');
const connectFlash = require('connect-flash');


const app = express();
const cors = require("cors");
require("dotenv").config({ path: "./config.env" });
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


// app.use(require("./routes/record"));
// get driver connection

//const MongoStore = connectMongo(session);

//Init Session
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: true,
            httpOnly: true
        },
        //store: new MongoStore({ mongooseConnection: mongoose.connection }),

    })
)
app.use(connectFlash())

const dbo = require("./db/connection");
const { connect } = require("./routes/auth");
//middleware
app.use(morgan('dev'))
    //Routes
app.use('/auth', require('./routes/auth'))
app.use('/users', require('./routes/user'))


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

mongoose
    .connect(process.env.ATLAS_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,

    })
    .then(() => console.log("db Connected"));

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});