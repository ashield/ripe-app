var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
    passportLocalMongoose = require('passport-local-mongoose'),
    bcrypt = require('bcrypt');
    var passport = require('passport');
    var _ = require('lodash');


var projectSchema = Schema ({
	name: String,
	description: String,
	status: Number, // 1 = To do, 2 = in progress, 3 = done
	date: Date,
	position: Number,
	tasks: [{ type: Schema.Types.ObjectId, ref: 'Task'}]
})

var taskSchema = Schema ({
	taskname: String,
	taskdescription: String,
	user: { type: String, ref: 'Users'},
	_project: { type: Schema.Types.ObjectId, ref: 'Project' },
	complete: { type: Boolean, default: false }
})

var settingsSchema = Schema ({
	team: [{ name: String, emailAddress: String }]
})

var Project  = mongoose.model('Project', projectSchema),
	Task = mongoose.model('Task', taskSchema),
	Settings = mongoose.model('Settings', settingsSchema);

var Users = require('./models/user');


// LOGIN

exports.login = function (req, res) {
    res.render('login', { title : "Login to Ripe App" });
}

// authenticates a user through passport
exports.loginUser = function (req, res, next) {
     passport.authenticate('local', function(err, user, info) {
       if (err) { return next(err); }
       if (!user) { return res.redirect('/login'); }
       req.login(user, function(err) {
         if (err) { return next(err); }
         return res.redirect('/');
       });
     })(req, res, next);
   }

   // return res.render("login", {title: 'Login to Ripe App', validation: 'Sorry. Something went wrong. Try again.'});

// REGISTER

exports.register = function (req, res) {
    res.render('register', {title: 'Register for Ripe App'});
}

// registers a user through passport
exports.registerUser = function (req, res) {
        Users.register(new Users({ username : req.body.username }), req.body.password, function(err, account) {
            if (err) {
              return res.render("register", {title: 'Register for Ripe App', validation: 'Sorry. Something went wrong. Try again.'});
            }

            passport.authenticate('local')(req, res, function () {
              res.redirect('/users/' + req.user._id);
              // res.send(account);
            });
        });
}

// LOGOUT

exports.logout = function (req, res) {
    req.logout();
    res.redirect('/login');
}

// DASHBOARD

exports.dashboard = function (req, res) {
        if (req.user) {
            res.render('index', {title: 'Ripe App', text: "Use Ripe to plan out any web project with simpicity", user: req.user});
        } else {
            res.redirect('/login');
        }
}

// PROJECTS

// create project
exports.createProject = function(req, res) {
    var project = new Project({
        name: req.body.name,
        description: req.body.description,
    });

    project.save(function (err, project) {
    	if (err) return console.error(err);
    });

	res.redirect('/projects/' + project._id);

};

// renders the page to enter new project details
exports.new = function (req, res){
	res.render('new', {title: 'Add project', user: req.user});
}

// adds and updates tasks within a project
exports.ProjectUpdateTasks = function (req, res) {
    Project.findOne({'_id':mongoose.Types.ObjectId(req.param('id'))}, function (err, project) {
        if (err) return console.error(err); // change to 404 page

        var task = new Task ({
            taskname: req.body.taskname,
            taskdescription: req.body.taskdescription,
            _project: project._id ,
            user: req.body.user
        });
    
        task.save(function (err) {
          if (err) return console.error(err);
        });

        project.tasks.push(task);

        project.save(function (err, project) {
            if (err) return console.error(err);
       });

        Users.findOne({ username: task.user})
        .exec(function (err, user) {
          if (err) return console.error(err);
          if (user){
          user._tasks.push(task);
          user.save();
        }
          
        });

    res.redirect(req.get('referer'));

   });
}

// renders the /projects page
exports.allProjects = function (req, res) {
    Project.find({})
    .populate('tasks')
    .exec(function(error, data) {
    var output = [];
        data.forEach(function(o) {
            output.push(o.tasks);
        });

       if (req.user) {
                res.render('projects', {projects: data, title: 'Projects', text: "This is your current project overview. Click on a project to see more", tasks: output, user: req.user});
           } else {
               res.redirect('/login');
           }
        
        })

};

// renders the individual project page
exports.showOneProject = function (req, res) {
    Project.findOne({'_id':mongoose.Types.ObjectId(req.param('id'))}, function (err, project) {
    	if (err) return console.error(err);

            Task.find({_project: project._id}, function (err, tasks) {
                if (err) return console.error(err);

            Users.find('username', function (err, users) {
                if (err) return console.error(err);
                res.render('individual-project', {project: project, title: project.name, tasks: tasks, users: users, user: req.user} );
            
                });
            });
    });
};

// TASKS

// create and individual task for a user
exports.createTask = function(req, res) {
    var task = new Task({
        taskname: req.body.taskname,
        taskdescription: req.body.taskdescription,
        user: req.user.username

     });
        task.save(function (err, task) {
        if (err) return console.error(err);
        res.redirect(req.get('referer'));

    });
};

// this is just used for checking tasks during dev
exports.showTask = function (req, res) {
    Task.findOne({'_id':mongoose.Types.ObjectId(req.param('id'))}, function (err, task) {
    	if (err) return console.error(err);
        res.render('individual-tasks', { user: req.user} )
    });
};


// USERS

// this is not currently used but will be when setting is up and running
exports.allUsers = function (req, res) {
    Users.find(function (err, users) {
        if (err) return console.error(err);
        res.redirect('/login');
    })
};

// show all tasks assigned to the logged in user
exports.myTasks = function (req, res) {
    Users.findOne({'_id':mongoose.Types.ObjectId(req.param('id'))}, function (err, user) {
    	if (err) return console.error(err);

            Task.find({user: user.username})
            .populate('_project')
            .exec(function(error, data) {
            var output = [];
                data.forEach(function(o) {
                       output.push(o.tasks);
                   });  

            if (req.user) {
                    res.render('individual-tasks', {tasks: data,  text: "These are all the tasks assigned to you either individually or through projects", title: user.username + "'s tasks", user: req.user});
                } else {
                    res.redirect('/login');
                }
    	
            })
    });
};

// updates individual tasks through inline edit
exports.updateIndividualTasks = function (req, res) {
    Task.findOne({'_id':mongoose.Types.ObjectId(req.param('id'))}, function (err, task) {
        if (err) return console.error(err);
        task['taskname'] = req.body.taskname;
        task.save()
        console.log(task)
        res.json({success: true});
    });
}

// checks off tasks and crosses them out in the UI
exports.checkOffTasks = function (req, res) {
    Task.findOne({'_id':mongoose.Types.ObjectId(req.param('id'))}, function (err, task) {
        if (err) return console.error(err);
        task['complete'] = req.body.complete;
        task.save()
        res.json({success: true});
    });
}

// used to view and individual task
exports.showSingleTask = function (req, res) {
    Task.findOne({'_id':mongoose.Types.ObjectId(req.param('id'))}, function (err, task) {
        if (err) return console.error(err);
        res.render('individual-tasks' , {tasks: task, user: req.user})
    });
};

// deletes and individual task
exports.deleteTask = function (req, res) {
    Task.remove({'_id':mongoose.Types.ObjectId(req.param('id'))}, function (err, task) {
        if (err) return console.error(err); // change to 404 page
        res.json({success: true});
    });
}

// deletes and entire project
exports.deleteProject = function (req, res) {
    Project.remove({'_id':mongoose.Types.ObjectId(req.param('id'))}, function (err, project) {
        if (err) return console.error(err); // change to 404 page
        res.json({success: true});
    });
}

// renders the setting screen for and individual user.
exports.settings = function (req, res) {
    Users.findOne({'_id':mongoose.Types.ObjectId(req.param('id'))}, function (err, user) {
        if (err) return console.error(err);
        if (req.user) {
                res.render('settings', {title: "Hello " + user.username, user: req.user})
            } else {
                res.redirect('/login');
            }        
    });
};

