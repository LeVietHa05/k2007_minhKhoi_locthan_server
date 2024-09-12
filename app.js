var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors')
const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        const connect = await mongoose.connect(process.env.DB_URI)
        console.log('DB Connected')
    } catch (e) {
        console.log(e)
        process.exit(1)
    }
}

connectDB();
var indexRouter = require('./routes/index');

var app = express();

app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

module.exports = app;
