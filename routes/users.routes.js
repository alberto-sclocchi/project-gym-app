const router = require('express').Router();
const bcryptjs = require("bcryptjs");
const User = require("../models/User.model");
const isLoggedIn = require("../utils/isLoggedIn.js");
const uploadImg = require("../config/cloudinary.js");
const transporter = require("../config/nodemailer.js");
const isTempPassword = require("../utils/isTempPassword.js")


/* GET home page */
router.get("/sign-up", (req, res, next) => {
    res.render("auth/sign-up");
});

router.post(("/sign-up"), async (req, res, next)=>{
    const saltRounds = 10;
    const {username, email, password, confirmationEmail} = req.body;

    try{
        const salt = await bcryptjs.genSalt(saltRounds);
        const hashedPassword = await bcryptjs.hash(password, salt)
        const newUser = await User.create({
            username: username,
            email: email,
            password: hashedPassword,
            regular: true,
            admin: false,
            banned: false,
            isTempPassword: false
        })

        if(confirmationEmail){
            const signUpEmail = await transporter.sendMail({
                from: "fitHUB@mail.com",
                to: email,
                subject: "Thank you for signing up",
                text: "Thank you for signing up", 
                html: `<h2>Hi there, ${username}</h2>
                <h4>Thank you for signing up in FitHub.<h4>
                <hr>
                <p>You can now add your workout routines and track your physical progress. Good luck 😊.
                <br><img src="https://i.gifer.com/2DV.gif" style="width: 150px; margin-top: 20px">
                <p> Sincerely, <br>your FitHub Team</p>`
            });
        }

        req.session.currentUser = newUser;

        req.flash("successMessage", "Your account was successfully created.")
        res.redirect("/user-profile");
    } catch(err) {
        req.flash("errorMessage", "Sign up unsuccessful " + err)
        res.redirect("/sign-up");
    }
});


router.get("/log-in", (req, res, next) => {
    res.render("auth/log-in");
});


router.post("/log-in", (req, res, next) => {
    const {email, password} = req.body;

    if (email === '' || password === '') {
        req.flash("errorMessage", "Password and email cannot be blank");
        res.redirect('/log-in');
        return;
    }

    User.findOne({email: email})
    .then((user)=>{
        if (!user){
            req.flash("errorMessage", "Password or email are incorrect.");
            res.redirect("/log-in");
            return;
        }
        else if (bcryptjs.compareSync(password, user.password)){
            req.session.currentUser = user;
            console.log("Current User:",  req.session.currentUser);

            if(req.session.currentUser.isTempPassword){
                req.flash("successMessage", "Your password needs to be updated");
                res.redirect("/login/reset-password");
            } else{
                req.flash("successMessage", "You successfully logged in");
                res.redirect ("/user-profile");
            }
        }
        else{
            req.flash("errorMessage", "Password or email are incorrect.");
            res.redirect("/log-in");
        }
    })
    .catch((err)=>{
        next(err);
    })
});

router.get("/profile/edit", (req, res, next) => {
    res.render("auth/edit-profile", {user: req.session.currentUser});
});

router.post("/profile/edit", uploadImg.single("image"), (req, res, next) => {
    const {username, email} = req.body;

    const updateUser = {
        username,
        email
    };

    req.session.currentUser.username = updateUser.username;
    req.session.currentUser.email = updateUser.email;


    if(req.file){
        updateUser.image = req.file.path;
        req.session.currentUser.image = updateUser.image;
    }

    User.findByIdAndUpdate(req.session.currentUser._id, updateUser)
    .then(()=>{
        req.flash("successMessage","Your profile was updated")
        res.redirect("/user-profile");
    })
    .catch((err)=>{
        next(err);
    })

});

router.get("/user-profile", isLoggedIn, isTempPassword, (req, res, next) =>{
    User.findOne({email: req.session.currentUser.email})
    .then((user)=>{
        res.render("auth/user-profile", user)
    })
})

router.get("/login/forgot-password", async (req, res, next)=>{
    res.render("auth/forgot-password");
});

router.post("/login/forgot-password", async (req, res, next)=>{
    const email = req.body.email;

    try{
        const user = await User.findOne({email: email});
        if(!user){
          req.flash("errorMessage", "Email Not Found")
          res.redirect("/forgotPassword");
          return;

        } else {
          let newPassword = '';
          const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
          const charactersLength = characters.length;
          let counter = 0;

          while (counter < 10) {
            newPassword += characters.charAt(Math.floor(Math.random() * charactersLength));
            counter += 1;
          }
      
          const salt = await bcryptjs.genSalt(10);
          const hashedPassword = await bcryptjs.hash(newPassword, salt)
          const updateUser = await User.findByIdAndUpdate(
            user._id,
            {
                password: hashedPassword,
                isTempPassword: true
            }
          );
      
      
          const resetEmail = await transporter.sendMail({
            from: "movies&celebrities@mail.com", // sender address
            to: email,
            subject: "Password Reset", // Subject line
            text: "You Requested to reset your password", // plain text body
            html: `<h2>You requested to reset your password</h2><hr>
            <p>Your temporary password is <b>${newPassword}</b>, use it to create another password.</p>
            <p>Use the provided temporary password to log in and to create a new password. Make sure you won't forget next time ;)</p><hr>
            <p> Sincerely,<br>your FitHub Team</p>`// html body
          });
      
          res.redirect("/log-in");
        }
    } catch(err){
        next(err);
    }
      
});


router.get("/login/reset-password", async (req, res, next)=>{
    res.render("auth/reset-password");
});

router.post("/login/reset-password", async (req, res, next)=>{
    const {temporaryPassword, password} = req.body;

    try{
        if(bcryptjs.compareSync(temporaryPassword, req.session.currentUser.password)){
            //generate new password
            const salt = await bcryptjs.genSalt(10);
            const newHashedPassword = await bcryptjs.hash(password, salt);

            //update user
            const updateUserPass = await User.findByIdAndUpdate(req.session.currentUser._id, {password: newHashedPassword, isTempPassword: false});

            //update session
            req.session.currentUser.password = newHashedPassword;
            req.session.currentUser.isTempPassword = false;
            console.log(req.session.currentUser)

            //redirect
            req.flash("successMessage","Your password was updated.");
            res.redirect("/user-profile");

        } else{
            req.flash("errorMessage","The temporary password is incorrect.");
            res.redirect("/login/reset-password");
        }
        
    } catch (err){
        next(err)
    }
});

router.post("/log-out", (req, res, next) =>{
    req.session.destroy((err)=>{
        if(err) next(err);
        res.redirect ("/");
    })
});


module.exports = router;
