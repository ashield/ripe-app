var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    passportLocalMongoose = require('passport-local-mongoose'),
    bcrypt = require('bcrypt');

var usersSchema = Schema ({
	username: String,
	password: String,
	googleAccount: String,
	userId: String,
	image: String, // image source from third party
	_tasks: [{ type: Schema.Types.ObjectId, ref: 'Task'}]
})

usersSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('Users', usersSchema);