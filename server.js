const express = require("express");
const morgan = require("morgan")
const bodyParser = require("body-parser")
const createHttpError = require('http-errors');

const app = express();
const cors = require("cors");
require("dotenv").config({ path: "./config.env" });
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
// app.use(require("./routes/record"));
// get driver connection
const dbo = require("./db/connection");
//middleware
app.use(morgan('dev'))
    //Routes
app.use('/users', require('./routes/users'))

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



app.listen(port, () => {
    // perform a database connection when server starts
    dbo.connectToServer(function(err) {
        if (err) console.error(err);
    })
    console.log(`Server is running on port: ${port}`);
});