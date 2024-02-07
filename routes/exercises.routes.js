const router = require('express').Router();
const Exercise = require("../models/Exercise.model");
const Calendar = require("../models/Calendar.model");
const Routine = require("../models/Routine.model");
const isLoggedIn = require("../utils/isLoggedIn.js");
const axios = require("axios");


/* GET home page */
router.get("/", (req, res, next) => {
    res.render("exercises/body-parts")
});


router.get("/:bodyPart", (req, res, next) => {
    Exercise.find({bodyPart: req.params.bodyPart})
    .then((exercises)=>{
        res.render("exercises/exercises", {exercises});
    })
    .catch((err)=>{
        next(err);
    })
});

router.get("/add/:id", isLoggedIn, async (req, res, next) => {
    
    try{
        const calendars = await Calendar.find({addedBy: req.session.currentUser._id});
        const exercise = await Exercise.findById(req.params.id);
        
        res.render("exercises/add-exercise", {calendars, exercise})
    } catch(err){
        next(err);
    }
    
});

router.post("/add/:id", isLoggedIn, async (req, res, next)=>{
    const {calendar, day, setCount, repCount} = req.body;

    try{
        const exerciseAdded = await Exercise.findById(req.params.id);
       
        const routineCreated = await Routine.create({
            exercise: exerciseAdded,
            setCount,
            repCount
        });

        const calendarUpdated = await Calendar.updateMany(
            {_id: calendar},
            {$push: {[day] : routineCreated}},
            {multi: true}
        );

        res.redirect("/calendars");
    } catch(err){
        next(err)
    }
})


router.get("/:bodyPart/:idApi", isLoggedIn, async (req, res, next) => {

    try{
        // const options = {
        //     method: 'GET',
        //     url: `https://exercisedb.p.rapidapi.com/exercises/exercise/${req.params.idApi}`,
        //     headers: {
        //         'X-RapidAPI-Key': process.env.API_KEY_EX,
        //         'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
        //     }
        // };

        // const response = await axios.request(options);

        // console.log(response.data);

        console.log("-=-=-=-=-=-=-=-=-=-=-=--=-=-=-=-=-=-=-")

        const exercise = await Exercise.findOne({id: req.params.idApi});

        console.log(exercise);
        
        // res.render("exercises/exercise-details", {gifUrl: response.data.gifUrl, exercise});
        res.render("exercises/exercise-details", {exercise});
    } catch(err){
        next(err);
    }
});


module.exports = router;