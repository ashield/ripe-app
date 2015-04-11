var express = require('express'),
    path = require('path'),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    expressSession = require('express-session'),
    mongoose = require('mongoose'),
    expressHbs = require('express-handlebars'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;
    GoogleStrategy = require('passport-google'),
    ripe = require('./ripe'),
    app = express();


// Passposrt Auth


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('hbs', expressHbs({extname: 'hbs', defaultLayout: 'main.hbs'}));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// PASSPORT
app.use(methodOverride());
app.use(expressSession({secret: 'mySecretKey'}));
app.use(passport.initialize());
app.use(passport.session());

var Users = require('./models/user');
passport.use(Users.createStrategy());
passport.use(new LocalStrategy(Users.authenticate()));
passport.serializeUser(Users.serializeUser());
passport.deserializeUser(Users.deserializeUser());


// PROJECTS

// app.get('/projects.json', function (req, res) {
//     res.json([1 ,2, 3, 4, 5]);
// })

app.route('/')
    .get(ripe.dashboard)

    app.get('/projects/new', ripe.new);

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
    .post(ripe.ProjectUpdateTasks)

    .delete(ripe.deleteProject);


// Individual task test
app.route('/projects/:id/:id')
// app.route('/projects/:project_id/tasks/:id')
    // view a project item
    .get(ripe.showTask)

    .post(ripe.updateIndividualTasks)

    .delete(ripe.deleteTask);

app.route('/tasks/:id')
    .post(ripe.updateTasks)

    .get(ripe.showSingleTask)


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

    .post(ripe.createTask)


app.route('/users/:id/:id')
    .post(ripe.updateIndividualTasks)

    .patch(ripe.checkOffTasks)

    .delete(ripe.deleteTask);

app.route('/login')
    .get(ripe.login)

    .post(ripe.loginUser);


app.route('/register')
    .get(ripe.register)

    .post(ripe.registerUser)

app.route('/logout')
    .get(ripe.logout)

// SETTINGS
app.route('/settings/:id')
    .get(ripe.settings)



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
