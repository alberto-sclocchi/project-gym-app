const {Schema, model} = require("mongoose");

const exerciseSchema = new Schema ({
    bodyPart: {type: String, required: true},
    equipment: {type: String, required: true},
    giftUrl: {type: String},
    id: {type: String, required: true},
    name: {type: String, required: true},
    target: {type: String, required: true, default:"Unknown"},
    secondaryMuscles: {type: [String], default:"No Secondary Muscles"},
    instructions: {type: [String], default:"No Instructions"}
});

module.exports = model('Exercise', exerciseSchema);