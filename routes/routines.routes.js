const router = require('express').Router();
const Routine = require("../models/Routine.model");
const isLoggedIn = require("../utils/isLoggedIn");

/* GET home page */
router.post("/delete/:id", isLoggedIn, (req, res, next) => {
    Routine.findByIdAndDelete(req.params.id)
    .then(()=>{
        req.flash("successMessage", "Routine was successfully deleted from calendar");
        res.redirect("/calendars");
    })
    .catch((err)=>{
        next(err);
    })
});

module.exports = router;
