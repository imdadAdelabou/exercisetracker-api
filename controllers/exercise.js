const Exercise = require("../models/exercise.js");

exports.assignExerciseToUser = async(data) => {
    console.log(data.user);
    let exercise = new Exercise(data);
    return exercise.save();
}

exports.getAllUserExercises = (id, limit, from, to) => {
    let splitForm;
    let splitTo;
    if (from != undefined && to != undefined) {
        splitForm = from.split('-');
        splitTo = to.split('-');
    }

    return Exercise.find({
        user: { _id: id },
        created_on: {
            $gte: splitForm != undefined ? new Date(Number(splitForm[0]), Number(splitForm[1]), Number(splitForm[2])) : null,
            $lt: splitTo != undefined ? new Date(Number(splitTo[0]), Number(splitTo[1]), Number(splitTo[2])) : null,
        }
    }).limit(limit);
}