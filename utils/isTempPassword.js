function isTempPassword (req, res, next){
    if(req.session.currentUser){
        if(req.session.currentUser.isTempPassword){
            req.flash("errorMessage", "I am sorry you have to create a new password before navigating in the website");
            res.redirect ("/login/reset-password")
        }
    }
    next();
}

module.exports = isTempPassword;