var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
    passportLocalMongoose = require('passport-local-mongoose'),
    bcrypt = require('bcrypt');
    var passport = require('passport');


var projectSchema = Schema ({
	name: String,
	description: String,
	user: String, // user who created project
	status: Number, // 1 = To do, 2 = in progress, 3 = done
	date: Date,
	position: Number,
	// tasks: [{ type: Schema.Types.ObjectId, ref: 'Task'}]
	tasks: ['Tasks']
})

var taskSchema = Schema ({
	taskname: String,
	taskdescription: String,
	user: { type: String, ref: 'Users'}, // need to default to current user
	_project: { type: Schema.Types.ObjectId, ref: 'Project' }, // project that the task is associated, allowed to be null as tasks can be created individul from projects
	complete: { type: Boolean, default: false }
})

var settingsSchema = Schema ({
	team: [{ name: String, emailAddress: String }]
})

var Project  = mongoose.model('Project', projectSchema),
	Task = mongoose.model('Task', taskSchema),
	// Users = mongoose.model('Users', usersSchema),
	Settings = mongoose.model('Settings', settingsSchema);


var Users = require('./models/user');


// LOGIN

function loggedIn(req, res, next) {
    if (req.user) {
        next();
    } else {
        res.redirect('/login');
    }
}

exports.login = function (req, res) {
    res.render('login', { title : "Login" });
}

exports.loginUser = function (req, res, next) {
     passport.authenticate('local', function(err, user, info) {
       if (err) { return next(err); }
       if (!user) { return res.redirect('/login'); }
       req.login(user, function(err) {
         if (err) { return next(err); }
         return res.redirect('/');
       });
       console.log(user.username);
     })(req, res, next);
   }

// REGISTER

exports.register = function (req, res) {
    res.render('register', {title: 'Register for Ripe App'});
}

exports.registerUser = function (req, res) {
        Users.register(new Users({ username : req.body.username }), req.body.password, function(err, account) {
            if (err) {
              return res.render("register", {title: "Sorry. That username already exists. Try again."});
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
            console.log(req.user.username);
            res.render('index', {title: 'Ripe App', user: req.user});
        } else {
            res.redirect('/login');
        }
}

// PROJECTS

exports.createProject = function(req, res) {
    var project = new Project({
        name: req.body.name,
        description: req.body.description,
    });

    project.save(function (err, project) {
    	if (err) return console.error(err);
    });

  // this will redirect to /projects/id to allowed for tasks to be added
	// res.send(project);
	res.redirect('/projects/' + project._id);
};

exports.new = function (req, res){
	res.render('new', {title: 'Add project'});
}

exports.ProjectUpdateTasks = function (req, res) {
    Project.findOne({'_id':mongoose.Types.ObjectId(req.param('id'))}, function (err, project) {
        if (err) return console.error(err); // change to 404 page

	    var task = new Task ({
	    	taskname: req.body.taskname,
	    	taskdescription: req.body.taskdescription,
	    	_project: project._id ,
	    	user: req.body.user
	    });

			/* figure out how to save under `project` */
			console.error(project.tasks);
			var task = _.find(project.tasks, {'_id': req.body.task_id })
	    task.save(function (err) {
	      if (err) return console.error(err);
	      console.log(task)

	    });

		project.tasks.push(task);

		project.save(function (err, project) {
	   		if (err) return console.error(err);
	   		// console.log(project.tasks);
	   });

	// user.save(function (err, user) {
	// 	if (err) return console.error(err);
   	    Users.findOne({ username: task.user})
	    .populate('_tasks')  // populate isn't actually working, push is doing this
	    .exec(function (err, user) {
	      if (err) return console.error(err);
	      user._tasks.push(task);
	      console.log(user)
	      user.save();
     	});
	// });

   	res.json(project);

   });
}


exports.allProjects = function (req, res) {
    Project.find(function (err, projects) {
        if (err) return console.error(err);
        // res.send(projects);
        res.render('projects', {projects: projects, title: 'Projects'});
    })
};

exports.showOneProject = function (req, res) {
    Project.findOne({'_id':mongoose.Types.ObjectId(req.param('id'))}, function (err, project) {
    	if (err) return console.error(err);
    	// console.log(project.tasks[0].taskname)
    	// res.send(project);
    	res.render('individual-project', {project: project, title: project.name});
    });
};

exports.findProjectById = function(id){
	Project.findOne({'_id': mongoose.Types.ObjectId(id)}, function(err, project){
		if (err) return { error: err }
		return project;
	})
}


// TASKS

exports.createTask = function(req, res) {
    var task = new Task({
        taskname: req.body.name,
        taskdescription: req.body.description,
     });
        task.save(function (err, task) {
        if (err) return console.error(err);
        res.send(task);
    });
};

// this is just used for checking tasks during dev
exports.showTask = function (req, res) {
    Task.findOne({'_id':mongoose.Types.ObjectId(req.param('id'))}, function (err, task) {
    	if (err) return console.error(err);
    	// res.send(task);
        res.render('individual-tasks')
    });
};


// USERS

exports.allUsers = function (req, res) {
    Users.find(function (err, users) {
        if (err) return console.error(err);
        res.send(users);
    })
};

exports.createUser = function(req, res) {
    var user = new Users({
        username: req.body.username,
    });

  	res.send(user);

    user.save(function (err, user) {
    	if (err) return console.error(err);
    });
};

exports.myTasks = function (req, res) {
    Users.findOne({'_id':mongoose.Types.ObjectId(req.param('id'))}, function (err, user) {
    	if (err) return console.error(err);

    	Task.find({user: user.username}, 'taskname _project', function (err, tasks) {
    		if (err) return console.error(err);
    		for (var i=0; i < tasks.length; i ++ ){
    			console.log(tasks[i]._project);

    		// Project.find({_id: tasks[i]._project}, 'name', function (err, projects) {
    		// 	if (err) return console.error(err);
    		// 	for (var x=0; x < projects.length; x ++ ){
    		// 		console.log(projects[x].name);
    		// 	}
    		// });

    		}

    		// Project.find({'project.tasks.user': 'user.username'}, function (err, projects) {
    		// 	if (err) return console.error(err);
    		// 	console.log(projects);
    		// })

    		// res.send();
    		res.render('individual-tasks', {tasks: tasks, title: user.username});



    	});
    });
};

exports.updateTasks = function (req, res) {
	// fetch a project

	/* create a task */
	var project_id = req.body.project_id;
	var task_name = req.body.taskname;
	var project = findProjectById(req.params('id'));
	console.error(project);
	res.json({success: "created..."})
	/* add it to projet tasks */
    // Task.findOne({'_id':mongoose.Types.ObjectId(req.param('id'))}, function (err, task) {
    //     if (err) return console.error(err);
		// 		console.error(req.params);
    //     task['taskname'] = req.body.taskname;
    //     task.save()
    //     res.send(task)
    // });
}

exports.showSingleTask = function (req, res) {
    Task.findOne({'_id':mongoose.Types.ObjectId(req.param('id'))}, function (err, task) {
        if (err) return console.error(err);
        // res.send(task);
        res.render('individual-tasks' , {tasks: task})
    });
};
