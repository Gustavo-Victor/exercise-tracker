const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
    username: String,
});
const User = mongoose.model("User", UserSchema);

const ExerciseSchema = new Schema({
    user_id: { type: String, required: true },
    description: String,
    duration: Number,
    date: Date,
});
const Exercise = mongoose.model("Exercise", ExerciseSchema);


module.exports = { User, Exercise }; 