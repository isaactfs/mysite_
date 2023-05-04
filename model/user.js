const mongoose = require('mongoose');
// const uniqueValidator = require('mongoose-unique-validator');

const UserSchema = new mongoose.Schema({

    username: {
        type: String,
        unique: true
    },
    password: {
        type: String, 
        required: true}
    },
    // {collation: 'users'}
);
// UserSchema.plugin(uniqueValidator, { message: 'uniqueUserNameError'});
const model = mongoose.model('User', UserSchema)



module.exports = model