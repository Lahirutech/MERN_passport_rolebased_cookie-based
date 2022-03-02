const express = require("express");
const morgan = require("morgan")
const bodyParser = require("body-parser")
const createHttpError = require('http-errors');
const mongoose = require("mongoose")

const app = express();
const cors = require("cors");
require("dotenv").config({ path: "./config.env" });
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// app.use(require("./routes/record"));
// get driver connection

const dbo = require("./db/connection");
//middleware
app.use(morgan('dev'))
    //Routes
app.use('/users', require('./routes/auth'))

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