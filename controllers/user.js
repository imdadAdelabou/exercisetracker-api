const User = require("../models/user.js");

exports.addUser = async(username) => {
    let user = User({ username: username });

    return user.save();
}