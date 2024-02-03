const {Schema, model} = require("mongoose");

const calendarSchema = new Schema ({
    title: {type: String, required: true},
    monday: {type:[Schema.Types.ObjectId], ref: "Routine"},
    tuesday: {type:[Schema.Types.ObjectId], ref: "Routine"},
    wednesday: {type:[Schema.Types.ObjectId], ref: "Routine"},
    thursday: {type:[Schema.Types.ObjectId], ref: "Routine"},
    friday: {type:[Schema.Types.ObjectId], ref: "Routine"},
    saturday: {type:[Schema.Types.ObjectId], ref: "Routine"},
    sunday: {type:[Schema.Types.ObjectId], ref: "Routine"},
    addedBy: {type: Schema.Types.ObjectId, ref:"User"}
});

module.exports = model('Calendar', calendarSchema);