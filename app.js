var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var ripe = require('./ripe');
var mongoose = require('mongoose');

var app = express();
var expressHbs = require('express-handlebars');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('hbs', expressHbs({extname: 'hbs', defaultLayout: 'main.hbs'}));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {
    res.render('index', {title: 'RipeApp'});
});

// PROJECTS

app.route('/projects')
    // Get all projects
    .get(ripe.allProjects)

    // create new project
    .post(ripe.createProject);

app.route('/projects/:id')
// view a project item
    .get(ripe.showOneProject)

//create new task in a project
    // .post(ripe.createTask)

// add tasks to a project
    .post(ripe.ProjectUpdateTasks);

// Individual task test
app.route('/projects/:id/:id')
    // view a project item
    .get(ripe.showTask)


// USERS
app.route('/users')
    // Get all projects
    .get(ripe.allUsers)

    // create new user
    .post(ripe.createUser);

// Individual users tasks
app.route('/users/:id')
    // view a project item
    .get(ripe.myTasks)



// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;

mongoose.connect('mongodb://localhost/ripedb');

var db = mongoose.connection;
db.on('error', function callback () {
    console.error('connection error');
});
db.once('open', function callback () {
    console.error('connection success');
});
