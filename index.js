require('dotenv').config()
const express = require('express');
const bodyParser = require("body-parser");
const connectToDb = require("./utils/connectdb.js");
const app = express()
const cors = require('cors')
const userCtrl = require("./controllers/user.js");
const exerciseCtrl = require("./controllers/exercise.js");
const isNotEmpty = require("./utils/isNotEmpty.js");


app.use(cors())
app.use(express.static('public'))
connectToDb().then(() => console.log("Server connected with succes")).catch((err) => console.log(err));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html')
});

app.route("/api/users").post((req, res, next) => {
    let username = req.body.username;

    if (username != undefined && username != "" && username != null) {
        next();
    } else {
        return res.status(400).json({ error: "Invalid username" });
    }
}, async(req, res, next) => {
    let result;
    try {
        result = await userCtrl.addUser(req.body.username);
    } catch (e) {
        return res.status(500).json({ err: "Internal Server" });
    }

    return res.status(200).json({ "username": result.username, "_id": result.id });
}).get(async(req, res, next) => {
    try {
        let result = await userCtrl.getUsers();
        return res.status(200).json(result);
    } catch (e) {
        return res.status(500).json({ error: "Internal Server" });
    }
});

app.post("/api/users/:_id/exercises", (req, res, next) => {
    let { description, duration, date } = req.body;

    if (isNotEmpty(description) && (isNotEmpty(duration) && Number(duration))) {
        if (!isNotEmpty(date)) {
            let actualDate = new Date();
            req.body.date = actualDate.toDateString();
        }
        req.body.duration = Number(req.body.duration);
        next();
    } else {
        return res.status(400).json({ error: "Invalid format" });
    }
}, async(req, res, next) => {
    let userId = req.params._id;
    userCtrl.getUser(userId).then(async(value) => {
        if (!value) {
            return res.status(404).json({ error: "User don't found" });
        }
        try {
            let result = await exerciseCtrl.assignExerciseToUser({
                user: value,
                ...req.body
            });

            return res.status(200).json({
                "_id": result.user._id,
                "username": result.user.username,
                "date": result.date,
                "duration": result.duration,
                "description": result.description
            });
        } catch (e) {
            return res.status(500).json({ error: e });
        }
    }).catch((err) => {
        return res.status(500).json({ error: "Internal Server" });
    });
});

app.get("/api/users/:_id/logs", (req, res, next) => {

    exerciseCtrl.getAllUserExercises(req.params._id, req.query.limit, req.query.from, req.query.to).then(async(value) => {
        if (!value) {
            return res.status(404).json({ body: "No user found", data: [] });
        }
        console.log(value);
        let user = await userCtrl.getUser(req.params._id);
        let filterList = [];
        if (value.length > 0) {
            for (let log of value) {
                filterList.push({
                    description: log.description,
                    duration: log.duration,
                    date: log.date,
                });
            }
        }
        return res.status(200).json({ username: user.username, count: value.length, _id: req.params._id, log: filterList });
    }).catch((err) => {
        console.log(err);
        return res.status(500).json({ error: "Internal Server Error" });
    });
});

const listener = app.listen(process.env.PORT || 3000, () => {
    console.log('Your app is listening on port ' + listener.address().port)
})