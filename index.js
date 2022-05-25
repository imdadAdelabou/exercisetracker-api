require('dotenv').config()
const express = require('express');
const bodyParser = require("body-parser");
const connectToDb = require("./utils/connectdb.js");
const app = express()
const cors = require('cors')
const userCtrl = require("./controllers/user.js");

app.use(cors())
app.use(express.static('public'))
connectToDb().then(() => console.log("Server connected with succes")).catch((err) => console.log(err));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html')
});

app.post("/api/users", (req, res, next) => {
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
});



const listener = app.listen(process.env.PORT || 3000, () => {
    console.log('Your app is listening on port ' + listener.address().port)
})