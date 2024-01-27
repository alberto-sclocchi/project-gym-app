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

module.exports = router;