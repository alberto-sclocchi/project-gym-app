function isLoggedIn (req, res, next){
    if(!req.session.currentUser){
        req.flash("errorMessage", "Log in to move forward")
        res.redirect("/log-in");
    }

    next();
}

module.exports = isLoggedIn;