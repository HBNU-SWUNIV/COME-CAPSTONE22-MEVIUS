var createError = require('http-errors');
var express = require('express');

var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// Setup MongoDB
var mongoose = require('mongoose');
var db = mongoose.connection;
db.on('error', console.error);
db.once('open', function () {
    // CONNECTED TO MONGODB SERVER
    console.log("Connected to mongod server");
});

// Construct mongodb connection
mongoose.connect('mongodb://localhost/vr_repo', { useNewUrlParser: true, useUnifiedTopology: true });

var indexRouter = require('./routes/index');
var vrRouter = require('./routes/vr');
var regionRouter = require('./routes/region');

// Admin route
var adminWorldRouter = require('./routes/admin');

var app = express();

// Body-parser
var bodyParser = require('body-parser');
app.use(bodyParser.json());

// File Upload
const fileUpload = require('express-fileupload');
// default options
//app.use(fileUpload());
//app.use(bodyParser.urlencoded());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

// for parsing multipart/form-data
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/vr', vrRouter);
app.use('/admin/regions', adminWorldRouter);// Admin 
app.use('/region/', regionRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;