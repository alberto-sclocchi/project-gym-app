const {Schema, model} = require("mongoose");

const routineSchema = new Schema ({
    exercise: {type: Schema.Types.ObjectId, ref: "Exercise"},
    setCount: {type: Number},
    repCount: {type: Number},
    day: {type: String}
});

module.exports = model('Routine', routineSchema);