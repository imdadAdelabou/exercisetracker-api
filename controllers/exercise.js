const Exercise = require("../models/exercise.js");

exports.assignExerciseToUser = async(data) => {
    console.log(data.user);
    let exercise = new Exercise(data);
    return exercise.save();
}