var mongoose = require('mongoose'),
	Schema = mongoose.Schema;
	// relationship = require("mongoose-relationship");

var projectSchema = Schema ({
	name: String,
	description: String,
	user: String, // user who created project
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

var usersSchema = Schema ({
	username: String,
	password: String,
	googleAccount: String,
	userId: String,
	image: String, // image source from third party
	_tasks: [{ type: Schema.Types.ObjectId, ref: 'Task'}]
})

var settingsSchema = Schema ({
	team: [{ name: String, emailAddress: String }]
})

var Project  = mongoose.model('Project', projectSchema),
	Task = mongoose.model('Task', taskSchema),
	Users = mongoose.model('Users', usersSchema),
	Settings = mongoose.model('Settings', settingsSchema);


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
	res.send(project); 
};

exports.ProjectUpdateTasks = function (req, res) {
    Project.findOne({'_id':mongoose.Types.ObjectId(req.param('id'))}, function (err, project) {
        if (err) return console.error(err); // change to 404 page
	    
	    var tasks = new Task ({
	    	taskname: req.body.taskname,
	    	taskdescription: req.body.taskdescription,
	    	_project: project._id,
	    	user: req.body.user
	    });

	    tasks.save(function (err) {
	      if (err) return console.error(err);
	      console.log('task_saved')
	    });

		Project.tasks = tasks._id;
		project.tasks.push(tasks._id);

   project.save(function (err, project) {
   		if (err) return console.error(err);
   });

   	    Users.findOne({ username: tasks.user})
	    .populate('tasks')  // populate isn't actually working, push is doing this
	    .exec(function (err, user) {
	      if (err) return console.error(err);
	      user._tasks.push(tasks._id);
	      console.log(user)

  	    user.save(function (err, project) {
     		if (err) return console.error(err);
     });
});

   res.send(project);

   });	
}

exports.allProjects = function (req, res) {
    Project.find(function (err, projects) {
        if (err) return console.error(err);
        // res.send(projects);
        res.render('projects', {projects: projects});
    })
};

exports.showOneProject = function (req, res) {
    Project.findOne({'_id':mongoose.Types.ObjectId(req.param('id'))}, function (err, project) {
    	if (err) return console.error(err);
    	res.send(project);
    });
};


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
    	res.send(task);
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
    	res.send(user._tasks);
    });
};


