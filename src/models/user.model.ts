import * as mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    username: {type: String,required:true},
    password: {type: String,required:true},
    validity: {type: Boolean,required:false},
});

const User = mongoose.model('user', UserSchema);

export { User }