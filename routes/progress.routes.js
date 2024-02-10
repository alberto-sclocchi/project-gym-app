const router = require('express').Router();
const Progress = require("../models/Progress.model.js")
const isLoggedIn = require("../utils/isLoggedIn.js");
const isTempPassword = require ("../utils/isTempPassword.js")



/* GET home page */
router.get("/", isLoggedIn, isTempPassword, (req, res, next) => {
    Progress.find()
    .then((allProgress)=>{
        const progress = allProgress.filter((pro)=> pro.addedBy.equals(req.session.currentUser._id));
        const date = progress.map((pro)=> pro.time.toLocaleDateString());
        
        res.render("progress/track-progress", {progress, date})
    })
    .catch((err)=>{
        next(err);
    })
});

router.get("/add", isLoggedIn, isTempPassword, (req, res, next) => {
    res.render("progress/add-progress");
});

router.post("/add", isLoggedIn, (req, res, next) => {
    const {weight, height, fatPercentage} = req.body;

    bmi = weight / (height ** 2);

    const newProgress = {
        weight,
        height,
        fatPercentage,
        addedBy: req.session.currentUser._id,
        bmi: bmi.toFixed(1)
    }

    if(newProgress.bmi > 30){
        newProgress.category = "Obesity";
    } 
    else if(newProgress.bmi >= 25){
        newProgress.category = "Overweight";
    } 
    else if(newProgress.bmi >= 18.5){
        newProgress.category = "Normal weight";
    } 
    else{
        newProgress.category = "Underweight";
    } 

    Progress.create(newProgress)
    .then(()=>{
        req.flash("successMessage","Your progress was recorded")
        res.redirect("/progress")
    })
    .catch((err)=>{
        next(err);
    })
});

router.post("/delete/:id", isLoggedIn, isTempPassword, (req, res, next) => {
    Progress.findByIdAndDelete(req.params.id)
    .then(()=>{
        req.flash("successMessage","Progress was successfully deleted.");
        res.redirect("/progress");
    })
    .catch((err)=>{
        next(err)
    })
});

module.exports = router;