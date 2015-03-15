var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var projectSchema = Schema ({
	_id: Number,
	name: String,
	description: String,
	user: String, // user who created project
	status: Number, // 1 = To do, 2 = in progress, 3 = done
	date: Date, 
	position: Number,
	tasks: [{ type: Schema.Types.ObjectId, ref: 'task' }]
})

var taskSchema = Schema ({
	name: String,
	description: String,
	user: [{ type: String, ref: 'project' }], // need to default to current user
	_project: [{ type: Number, ref: 'project', default: 0 }], // project that the taks is associated, allowed to be null as tasks can be created individul from projects
	complete: { type: Boolean, default: false }
})

var settingsSchema = Schema ({
	user: {
		username: String,
		password: String,
		googleAccount: String,
		userId: String,
		image: String // image source from third party
	},

	team: [{ name: String, emailAddress: String }]
})

var Project  = mongoose.model('Project', projectSchema),
	Task = mongoose.model('Task', taskSchema),
	Settings = mongoose.model('Settings', settingsSchema);
