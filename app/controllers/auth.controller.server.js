import express from 'express';

// need passport 
import passport from 'passport';

// need to include the User Model for authentication
import User from '../models/user.js';

// import DisplayName Utility method
import { UserDisplayName } from '../utils/index.js';

// Display Functions
export function DisplayLoginPage(req, res, next){
    if(!req.user){
        return res.render('index', {title: 'Login', page: 'login', messages: req.flash('loginMessage'), displayName: UserDisplayName(req) });
    }

    return res.redirect('/movie-list');
}

export function DisplayRegisterPage(req, res, next){
    if(!req.user){
        return res.render('index', {title: 'Register', page: 'register', messages: req.flash('registerMessage'), displayName: UserDisplayName(req)});
    }

    return res.redirect('/movie-list');
}

// Processing Function
export function ProcessLoginPage(req, res, next){
    passport.authenticate('local', function(err, user, info) {      //local strategy, function to be executed @ end of authentication
        if(err){
            console.error(err);
            res.end(err);
        }     
        
        if(!user){                                              //if user doesn't exist/ identified by this function
            req.flash('loginMessage', 'Authentication Error');
            return res.redirect('/login');
        }

        req.logIn(user, function(err){      
            if(err){
                console.error(err);
                res.end(err);
            }

            return res.redirect('/');       //if everything ok, make sure user inside request
        })
        
    })(req, res, next);
}

export function ProcessRegisterPage(req, res, next){
    let newUser = new User({
        username: req.body.username,
        emailAddress: req.body.emailAddress,
        displayName: req.body.firstName + " " + req.body.lastName       //merge first and last name with space between
    });

    User.register(newUser, req.body.password, function(err){
        if(err){
            if(err.name == "UserExistsError"){
                console.error('ERROR: User Already Exists!');
                req.flash('registerMessage', 'Registration Error')
            } else {
                console.error(err.name);
                req.flash('registerMessage', 'Server Error')
            }
            
            return res.redirect('/register');           //return response back to register for error message
        }

        return passport.authenticate('local')(req, res, function()      //if it went well and all checks out - response = good
        {
            return res.redirect('/');                       //return to homepage after successful password entry
        });
    });
}

export function ProcessLogoutPage(req, res, next){      //no page for logout rendering
    req.logOut(function(err){
        if(err){
            console.error(err);
            res.end(err);
        }

        console.log("user logged out successfully");
    });

    res.redirect('/login');
}