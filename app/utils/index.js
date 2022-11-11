
import jwt from 'jsonwebtoken';
import { Secret } from '../../config/config.js';

export function UserDisplayName(req){
    if(req.user){
        return req.user.displayName;
    }
    return '';
}

export function AuthGuard(req, res, next){
    if(!req.isAuthenticated()){
        return res.redirect('/login');
    }
    next();
}

export function GenerateToken(user){        //comming from model > user.js - part of model we encrypt as part of token (sent back/forth from client to server constantly)
    //will encypt this later, note you wont need password after 1st login, so no need to store as an exposed cookie
    const payload ={
        id: user._id,
        displayName: user.displayName,
        username: user.username,
        emailAddress: user.emailAddress
    }

    const jwtOption = {
        expiresIn: 604800 //1 week - ensures validation only available for 1 week
    }
    return jwt.sign(payload, Secret, jwtOption);        //assigns payload, expiration time in a single token - sign token w secret
}