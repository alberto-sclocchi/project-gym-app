const {Schema, model} = require("mongoose");

const calendarSchema = new Schema ({
    monday: {type:[Schema.Types.ObjectId], ref: "Exercise"},
    tuesday: {type:[Schema.Types.ObjectId], ref: "Exercise"},
    wednesday: {type:[Schema.Types.ObjectId], ref: "Exercise"},
    thursday: {type:[Schema.Types.ObjectId], ref: "Exercise"},
    friday: {type:[Schema.Types.ObjectId], ref: "Exercise"},
    saturday: {type:[Schema.Types.ObjectId], ref: "Exercise"},
    sunday: {type:[Schema.Types.ObjectId], ref: "Exercise"},
    addedBy: {type: Schema.Types.ObjectId, ref:"User"}
});

module.exports = model('Calendar', calendarSchema);