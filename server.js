var express = require('express');
var app = express();
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');
var nodemailer = require('nodemailer');
var multiparty = require('connect-multiparty');
var multipartyMiddleware = multiparty();
var mongoose = require('mongoose');
var db = require('./config/db');
var Grid = require('gridfs-stream');
var routes = require('./routes/urlRoute');
//Models
var URL = require('./app/models/URL');

// set our port
var port = process.env.PORT || 8080;

//connect to mongoDB
mongoose.connect(db.url);
var conn = mongoose.connection;

Grid.mongo = mongoose.mongo;

// get all data/stuff of the body (POST) parameters
// parse application/json 
app.use(bodyParser.json());

// parse application/vnd.api+json as json
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
//app.use(methodOverride('X-HTTP-Method-Override'));

// set the static files location /public/img will be /img for users
app.use(express.static(__dirname + '/public'));

// routes ==================================================
//require('./app/routes')(app); // configure our routes

// ROUTES FOR OUR API
// =============================================================================


app.use('/', routes);

// handle 404
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// handle development error
// with stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// handle production error
// no stacktrace
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

// start app ===============================================
// startup our app at http://localhost:8080
app.listen(port);

// shoutout to the user                     
console.log('Magic happens on port ' + port);

// expose app           
exports = module.exports = app;