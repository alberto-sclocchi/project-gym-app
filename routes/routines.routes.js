const router = require('express').Router();
const Routine = require("../models/Routine.model");
const Calendar = require("../models/Calendar.model")
const isLoggedIn = require("../utils/isLoggedIn");
const isTempPassword = require("../utils/isTempPassword")

/* GET home page */
router.post("/delete/:id", isLoggedIn, isTempPassword, async (req, res, next) => {
    try{
        const routine = await Routine.findById(req.params.id);

        const calendarUpdate = await Calendar.findOneAndUpdate ({[routine.day]: {$in : routine._id }},{$pull: {[routine.day]: routine._id}});

        const routineDeleted = await Routine.findByIdAndDelete(req.params.id);

        req.flash("successMessage", "Routine was successfully deleted from calendar");
        res.redirect("/calendars");
    } catch (err){
        next(err);
    }
});

module.exports = router;
