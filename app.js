const express = require('express');
const path = require('path');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cookieParser = require("cookie-parser");
const fileUpload = require('express-fileupload'); 

const adminRoutes = require('./api/routes/admin');
const userRoutes = require('./api/routes/user');

mongoose.set('strictQuery', false);
// mongoose.connect('mongodb://durvab:'+process.env.MONGO_ATLAS_PW+'@15.206.7.200:28017/durvab?authSource=admin&readPreference=primary&directConnection=true&ssl=false', { useNewUrlParser: true });
mongoose.connect('mongodb+srv://durvarbanthia:durvarbanthia@cluster0.mempsye.mongodb.net/', { useNewUrlParser: true });

mongoose.Promise = global.Promise;

app.use(fileUpload({
    useTempFiles: true
}))

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cookieParser());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    if(req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

// set up template engines
app.set('view engine', 'ejs');

// static files
app.use('/public', express.static(path.join(__dirname, 'public')));

// Routes which should handle requests
app.use('/admin', adminRoutes);
app.use('/', userRoutes);

app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
})


module.exports = app;
