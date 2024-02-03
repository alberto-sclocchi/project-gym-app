const router = require('express').Router();
const Calendar = require("../models/Calendar.model.js");
const isLoggedIn = require("../utils/isLoggedIn.js");


/* GET home page */
router.get("/", isLoggedIn, (req, res, next) => {

    Calendar.find()
    .populate({
        path:"monday",
        populate:{
            path:"exercise",
            model:"Exercise"
        }
    })
    .populate({
        path:"tuesday",
        populate:{
            path:"exercise",
            model:"Exercise"
        }
    })
    .populate({
        path:"wednesday",
        populate:{
            path:"exercise",
            model:"Exercise"
        }
    })
    .populate({
        path:"thursday",
        populate:{
            path:"exercise",
            model:"Exercise"
        }
    })
    .populate({
        path:"friday",
        populate:{
            path:"exercise",
            model:"Exercise"
        }
    })
    .populate({
        path:"saturday",
        populate:{
            path:"exercise",
            model:"Exercise"
        }
    })
    .populate({
        path:"sunday",
        populate:{
            path:"exercise",
            model:"Exercise"
        }
    })
    .then((allCalendars)=>{
        const calendars = allCalendars.filter((cal)=> cal.addedBy.equals(req.session.currentUser._id));
        res.render("calendars/calendars", {calendars});
    })
    .catch((err)=>{
        next(err)
    })
});

router.get("/new", isLoggedIn, (req, res, next) => {
    res.render("calendars/new-calendar")
});

router.post("/new", isLoggedIn, (req, res, next) => {
    const title = req.body.title;

    Calendar.create({
        title: title,
        addedBy: req.session.currentUser._id
    })
    .then(()=>{
        res.redirect("/calendars");
    })
    .catch((err)=>{
        next(err);
    })
});

module.exports = router;