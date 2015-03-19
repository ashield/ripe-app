var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var projectSchema = Schema ({
	// _id: Number,
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


exports.create = function(req, res) {
    var project = new Project({
        name: req.body.name,
        description: req.body.description,
        user: req.body.user,
        status: req.body.status,
        date: req.body.date,
        position: req.body.position
     });
        project.save(function (err, project) {
        if (err) return console.error(err);
        res.send(project);
        // res.redirect('/');
    });
};




// exports.retrieveAll = function (req, res) {
//     Project.find(function (err, name, description) {
//         if (err) return console.error(err);
//         res.send(name, description);
//         // res.render('index', {items: items});
//     })
// };

// exports.show = function (req, res) {
//     Item.findOne({'_id':mongoose.Types.ObjectId(req.param('id'))}, function (err, item) {
//     	if (err) return console.error(err); // change to 404 page
//     	res.send(items);
//         // res.render('show', item)
//     });
// };

// exports.new = function (req, res) {
//     // res.render('new');
// };



// exports.edit = function (req, res) {
//     Item.findOne({'_id':mongoose.Types.ObjectId(req.param('id'))}, function (err, item) {
//         if (err) return console.error(err); // change to 404 page
//         res.send(items);
//         // res.render('edit', item)
//     });
// };

// exports.update = function (req, res) {
//     Item.findOne({'_id':mongoose.Types.ObjectId(req.param('id'))}, function (err, item) {
//         if (err) return console.error(err); // change to 404 page
//         item['name'] = req.body.name;
//         item['description'] = req.body.description;
//         item.save()
//         res.send(items);
//         // res.render('show', item)
//     });
// }

// exports.delete = function (req, res) {
//     Item.remove({'_id':mongoose.Types.ObjectId(req.param('id'))}, function (err, item) {
// 	    if (err) return console.error(err); // change to 404 page
// 	    res.json({success: true});
// 	});
// }
