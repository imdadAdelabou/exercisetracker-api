const mongoose = require("mongoose");

const exerciseSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    description: { type: String },
    date: { type: String },
    duration: {
        type: Number,
    },
});

const exerciseModel = mongoose.model("Exercise", exerciseSchema);
module.exports = exerciseModel;