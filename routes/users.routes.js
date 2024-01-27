const router = require('express').Router();
const bcryptjs = require("bcryptjs");
const User = require("../models/User.model");

/* GET home page */
router.get("/sign-up", (req, res, next) => {
    res.render("auth/sign-up");
});

router.post(("/sign-up"), async (req, res, next)=>{
    const saltRounds = 10;
    const {username, email, password} = req.body;

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

        // if(confirmationEmail){
        //     const signUpEmail = await transporter.sendMail({
        //         from: "movies&celebrities@mail.com",
        //         to: email,
        //         subject: "Thank you for signing up",
        //         text: "Thank you for signing up", 
        //         html: `<h2>Hi there, ${username}</h2>
        //         <h4>Thank you for signing up. Can't wait for you to add new movies in our database.<h4>
        //         <hr>
        //         <p>You can now add your favorite movies and showcase them to other users. Good luck 😊.
        //         <br><img src="https://i.gifer.com/2DV.gif" style="width: 150px; margin-top: 20px">
        //         <p> Sincerely, <br>your Movies&Celebrities Team</p>`
        //     });
        // }
        
        req.flash("successMessage", "Your account was successfully created.")
        res.redirect("/login");
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
        res.redirect('/login');
        return;
    }

    User.findOne({email: email})
    .then((user)=>{
        if (!user){
            req.flash("errorMessage", "Password or email are incorrect.");
            res.redirect("/login");
            return;
        }
        else if (bcryptjs.compareSync(password, user.password)){
            req.session.currentUser = user;
            console.log("Current User:",  req.session.currentUser);
            
            if(req.session.currentUser.isTempPassword){
                req.flash("successMessage", "Your password needs to be updated.");
                res.redirect("/login/resetPassword");
            } else{
                req.flash("successMessage", "You successfully logged in.");
                res.redirect ("/");
            }
        }
        else{
            req.flash("errorMessage", "Password or email are incorrect.");
            res.redirect("/login");
        }
    })
    .catch((err)=>{
        next(err);
    })
});

router.post("/log-out", (req, res, next) =>{
    req.session.destroy((err)=>{
        if(err) next(err);
        res.redirect ("/");
    })
});

module.exports = router;
