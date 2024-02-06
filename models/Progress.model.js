const {Schema, model} = require("mongoose");

const progressSchema = new Schema ({
    weight: {type: Number, required: [true, "Please add your weight"]},
    height: {type: Number, required: [true, "Please add your height"]},
    fatPercentage : {type: Number, default: "Unknown"},
    bmi: {type: Number, default: "Unknown"},
    category: {type: String, enum: ["Underweight", "Normal weight","Overweight", "Obesity"]},
    time: {type: Date, default: Date.now},
    addedBy: {type: Schema.Types.ObjectId, ref: "User"}
});

module.exports = model('Progress', progressSchema);