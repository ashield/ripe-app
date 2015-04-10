var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
    passportLocalMongoose = require('passport-local-mongoose'),
    bcrypt = require('bcrypt');
    var passport = require('passport');
    var _ = require('lodash');


var projectSchema = Schema ({
	name: String,
	description: String,
	// user: String, // user who created project
	status: Number, // 1 = To do, 2 = in progress, 3 = done
	date: Date,
	position: Number,
	tasks: [{ type: Schema.Types.ObjectId, ref: 'Task'}]
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
	Settings = mongoose.model('Settings', settingsSchema);


var Users = require('./models/user');


// LOGIN

// function loggedIn(req, res, next) {
//     if (req.user) {
//         next();
//     } else {
//         res.redirect('/login');
//     }
// }

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
            res.render('index', {title: 'Ripe App', text: "Use Ripe to plan out any web project with simpicity", user: req.user});
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
	res.render('new', {title: 'Add project', user: req.user});
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
          if (user){
	      user._tasks.push(task);
          user.save();
      }
	      console.log(user)
	      
     	});
	// });

   	res.redirect(req.get('referer'));

   });
}


exports.allProjects = function (req, res) {
    Project.find(function (err, projects) {
        if (err) return console.error(err);

        Task.find('taskname', function (err, tasks) {
            if (err) return console.error(err);
            /// console.log(tasks)
            for (var i=0; i < tasks.length; i ++) {
                var taskname = tasks[i].taskname;
                // console.log(taskname)
            }

            // console.log(tasks[0].taskname)




            // if (req.user) {
                // console.log(req.user.username);
                res.render('projects', {projects: projects, title: 'Projects', text: "This is your current project overview. Click on a project to see more", tasks: tasks, user: req.user});
            // } else {
            //     res.redirect('/login');
            // }
            

            });

        // console.log(projects)

        // projects.forEach(function(project){
        //     console.log(project._id);
        //     Task.find({_project: project._id}), 'taskname', function (err, tasks) {
        //         if (err) return console.error(err);
        //         console.log(tasks);
        //         res.render('projects', {projects: projects, title: 'Projects', tasks: tasks.taskname});
        //     }
        // });

        // for (var i=0; i < projects.length; i ++ ){
         
        //  var tasks = projects[i].tasks;

   
         // tasks.forEach(function(task){


                 // for (var x=0; x < tasks.length; x ++ ){
                 //    var taskname = tasks[x].taskname;
                 //    // console.log(taskname);
                 // }    

            
            
        // })


// }
        // console.log(tasks)
    
        
        // res.send(tasks);
        
        // console.log(projects[0].tasks);
       

        // });
    })
};

exports.showOneProject = function (req, res) {
    Project.findOne({'_id':mongoose.Types.ObjectId(req.param('id'))}, function (err, project) {
    	if (err) return console.error(err);
    	// console.log(project.tasks[0].taskname)
    	// res.send(project);

            Task.find({_project: project._id}, function (err, tasks) {
                if (err) return console.error(err);

            Users.find('username', function (err, users) {
                if (err) return console.error(err);
                console.log(users);
           
                res.render('individual-project', {project: project, title: project.name, tasks: tasks, users: users, user: req.user} );
            
                });
            });
    });
};



// TASKS

exports.createTask = function(req, res) {
    var task = new Task({
        taskname: req.body.taskname,
        taskdescription: req.body.description,
        user: req.user.username

     });
        task.save(function (err, task) {
        if (err) return console.error(err);
        console.log(req.user.username)
        res.redirect(req.get('referer'));

    });
};

// this is just used for checking tasks during dev
exports.showTask = function (req, res) {
    Task.findOne({'_id':mongoose.Types.ObjectId(req.param('id'))}, function (err, task) {
    	if (err) return console.error(err);
    	// res.send(task);
        res.render('individual-tasks', { user: req.user} )
    });
};


// USERS

exports.allUsers = function (req, res) {
    Users.find(function (err, users) {
        if (err) return console.error(err);
        // res.send(users);
        res.redirect('/login');
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

    	Task.find({user: user.username}, function (err, tasks) {
    		if (err) return console.error(err);

            if (req.user) {
                    res.render('individual-tasks', {tasks: tasks, text: "These are all the tasks assigned to you either individually or through projects", title: user.username + "'s tasks", user: req.user});
                } else {
                    res.redirect('/login');
                }
    		

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


exports.updateIndividualTasks = function (req, res) {
    Task.findOne({'_id':mongoose.Types.ObjectId(req.param('id'))}, function (err, task) {
        if (err) return console.error(err);
        task['taskname'] = req.body.taskname;
        task['complete'] = req.body.complete;    
        task.save()
        console.log(task)
    });
}

exports.showSingleTask = function (req, res) {
    Task.findOne({'_id':mongoose.Types.ObjectId(req.param('id'))}, function (err, task) {
        if (err) return console.error(err);
        // res.send(task);
        res.render('individual-tasks' , {tasks: task, user: req.user})
    });
};


exports.deleteTask = function (req, res) {
    Task.remove({'_id':mongoose.Types.ObjectId(req.param('id'))}, function (err, task) {
        if (err) return console.error(err); // change to 404 page
        res.json({success: true});
    });
}

exports.deleteProject = function (req, res) {
    Project.remove({'_id':mongoose.Types.ObjectId(req.param('id'))}, function (err, project) {
        if (err) return console.error(err); // change to 404 page
        res.json({success: true});
    });
}

exports.settings = function (req, res) {
    Users.findOne({'_id':mongoose.Types.ObjectId(req.param('id'))}, function (err, user) {
        if (err) return console.error(err);
        if (req.user) {
                res.render('settings', {title: "Hello " + user.username, user: user})
            } else {
                res.redirect('/login');
            }        
    });
};

