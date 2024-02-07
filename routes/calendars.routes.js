const router = require('express').Router();
const Calendar = require("../models/Calendar.model.js");
const Routine = require("../models/Routine.model.js")
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

router.post("/edit/title/:id", isLoggedIn, (req, res, next) => {
    const title = req.body;

    Calendar.findByIdAndUpdate(
        req.params.id,
        title, 
        {new: true}
    ).then((response)=>{
        res.json(response);
    })
    .catch((err)=>{
        next(err);
    })
})

router.post("/delete/:id", isLoggedIn, async (req, res, next) => {
    try{
        const calendar = await Calendar.findById(req.params.id);
    
        if(!calendar.addedBy.equals(req.session.currentUser._id)){
            res.redirect("/calendars");
            return;
        }

        const routineDeleted = await Routine.deleteMany({_id: {$in: [...calendar.monday, ...calendar.tuesday, ...calendar.wednesday, ...calendar.thursday, ...calendar.friday, ...calendar.saturday, ...calendar.sunday]}});
        const calendarDeleted = await Calendar.findByIdAndDelete(req.params.id);

        res.redirect("/calendars");

    }catch (err){
        next(err);
    }
});

module.exports = router;