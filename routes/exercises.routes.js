const router = require('express').Router();
const Exercise = require("../models/Exercise.model");
const isLoggedIn = require("../utils/isLoggedIn.js");


/* GET home page */
router.get("/", isLoggedIn, (req, res, next) => {
    Exercise.find()
    .then((exercises)=>{
        res.render("exercises/exercises", {exercises});
    })
});


router.get("/:id", isLoggedIn, (req, res, next) => {
    Exercise.findById(req.params.id)
    .then((exercise)=>{
        res.render("exercises/exercise-details", exercise);
    })
});


module.exports = router;