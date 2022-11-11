import passport from 'passport';
import userModel from '../../models/user.js';
import { GenerateToken, UserDisplayName } from '../../utils/index.js';

export function processLogin(req, res, next){
    //no need to render here in api, only need to process info
    passport.authenticate('local', (err, user, info) => {
        if(err){
            console.error(err);
            res.end(err);
        }

        //are there any login errors?
        if(!user){       //if we !don't have a user
            return res.json({
                success: false,
                msg: 'ERROR: Authentication Failed'
            })
        }
        req.logIn(user, (err) => {
            //are there any errors?
            if(err){
                console.error(err);
                res.end(err);
            }
            const authToken = GenerateToken(user);

            return res.json ({
                success: true,
                msg: 'User Logged In Successfully',
                user: {
                    id: user._id,
                    displayName: user.displayName,
                    username: user.username,
                    emailAddress: user.emailAddress
                },
                token: authToken
            })
        })
    })(req, res, next);
}

export function processRegistration(req, res, next){
    let newUser = new userModel({
        //similar to ProcessResiterPage in auth.controller.server.js, but abbreviated - the following will assign any user.body attibutes
        ...req.body     ///any attrbutes under body that matches user will be matched automatically inside new user object
    });

    console.log(newUser);

    userModel.register(newUser, req.body.password, (err) => {
        if(err){
            console.error(err);

            return res.json({
                success: false,
                msg: 'Error Registration Failed'
            });
        }

        //if all ok
        return res.json({
            success: true,
            msg: 'User Registered Successfully'

        })
    })
}

export function processLogout(req, res, next){
    req.logOut((err) => {
        if(err){
            console.error(err);
            res.end(err);
        };
    });
    res.json({
        success: true,
        msg: 'User Logged Out Successfully'
    })
}