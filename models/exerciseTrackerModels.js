import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    }
});

const exerciseSchema = new mongoose.Schema({
    user_id: { type: String, required: true },
    description: String,
    duration: String,
    date: Date
});


const User = mongoose.model("Log", userSchema);
const Exercise = mongoose.model("Exercise", exerciseSchema);

export { User, Exercise }; 