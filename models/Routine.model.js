const {Schema, model} = require("mongoose");

const routineSchema = new Schema ({
    exercise: {type: Schema.Types.ObjectId, ref: "Exercise"},
    setCount: {type: Number},
    repCount: {type: Number}
});

module.exports = model('Routine', routineSchema);