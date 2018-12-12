const mongoose = require('mongoose');
const { Schema } = mongoose; // const Schema = mongoose.Schema

const userSchema = new Schema({
    googleID: String
});

// this code tells mongoose we want to create a new collection called users
// when mongoose boots up, if this collection already exits, it will not delete it
// if will only create it, if it does not exist
mongoose.model('users', userSchema);