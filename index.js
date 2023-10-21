import express from "express"; 
import cors from "cors";
import mongoose from "mongoose";
import { Exercise, User } from "./models/exerciseTrackerModels.js";
import { config } from "dotenv";
config(); 
const { DB_URI } = process.env;
const app = express();



app.use(cors())
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'))
app.get('/', (req, res) => {
    res.sendFile(process.cwd() + '/views/index.html')
});


app.post('/api/users', async (req, res) => {
    const { username } = req.body;

    if (!username) {
        res.json({ error: "Username is required" });
    }

    const userObj = new User({ username });

    try {
        const savedUser = await userObj.save();
        console.log(savedUser);
        res.json({ username: savedUser.username, _id: savedUser._id });
    } catch (e) {
        console.log(`User insertion failed: ${e}`);
        res.json({ error: e });
    }
});

app.post("/api/users/:id/exercises", async (req, res) => {
    const { date } = req.body;
    const id = req.body[":_id"];

    //if(!id) res.json({error: "ID is required"}); 
    //if(!duration) res.json({error: "Duration is required"}); 
    //if(!description) res.json({error: "Description is required"}); 

    try {
        const user = await User.findById(id);

        if (!user) {
            res.json({ error: "Could not find user" });
            return;
        }
        const exerciseObj = new Exercise({
            user_id: user._id,
            username: String(user.username),
            date: date ? new Date(date) : new Date(),
            duration: parseInt(req.body.duration),
            description: String(req.body.description),
        });

        const result = await exerciseObj.save();
        res.json({
            _id: user._id,
            username: user.username,
            date: new Date(result.date).toDateString(),
            duration: parseInt(result.duration),
            description: String(result.description),
        });

    } catch (e) {
        console.log('Error: ' + e);
        res.json({ error: "There was an error saving the exercise" });
    }

});

app.get("/api/users", async (req, res) => {
    try {
        const allUsers = await User.find({}).select("_id username");
        res.json(allUsers);
    } catch (e) {
        console.log(`Error: could no find data - ${e}`);
        res.json({ error: "Could not find data" });
    }

});

app.get("/api/users/:id/logs", async (req, res) => {
    const { id } = req.params;
    const { from, to, limit } = req.query;

    const user = await User.findById(id);

    if (!user) {
        res.json({ error: "Could not find user" });
    }

    //const { log } = user; 
    let dateObj = {};

    if (from) {
        dateObj["$gte"] = new Date(from);
    }

    if (to) {
        dateObj["$lte"] = new Date(to);
    }

    let filter = { user_id: id };

    if (from || to) {
        filter.date = dateObj;
    }

    const exercises = await Exercise.find(filter).limit(+limit ?? 500);

    if (!exercises) {
        res.json({ error: "Could not find expected data" });
    }

    const log = exercises.map(logItem => {
        return {
            description: String(logItem.description),
            duration: Number.parseInt(logItem.duration),
            date: new Date(logItem.date).toDateString()
        }
    });

    res.json({
        username: String(user.username),
        count: parseInt(exercises.length),
        _id: user._id.toString(),
        log
    });

});


mongoose.connect(`${DB_URI}`)
    .then(resp => {
        console.log(`Connected to MongoDB!`);
        const listener = app.listen(process.env.PORT || 3000, () => {
            console.log('Your app is listening on port ' + listener.address().port);
        })
    })
    .catch(err => console.log(`Connection failed: `, err));

