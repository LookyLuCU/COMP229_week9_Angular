/*
COMP229-F2022-ASSIGNMENT1-822281549
Sheila Donnelly
Student #822281549
October 7th, 2022
*/


// Third-Party Modules
import express from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import session from 'express-session';

// ES Modules fix for __dirname
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));

// Auth Step 1 - import modules
import passport from 'passport';
import passportLocal from 'passport-local';
import flash from 'connect-flash';

//modules for JWT support
import cors from 'cors';   //allows cross site/domain requests - for api or server to have multiple connectiosn with different IPs - can expose you to hijacked cookies
import passportJWT from 'passport-jwt';

//define JWT aliases
let JWTStrategy = passportJWT.Strategy;
let ExtractJWT = passportJWT.ExtractJwt;    //library offering us to decrypt infomramation

// Auth Step 2 - defien our auth strategy
let localStrategy = passportLocal.Strategy;

// Auth Step 3 - import the user model
import User from './models/user.js';

// Import Mongoose Module
import mongoose from 'mongoose';

// Configuration Module
import { MongoURI, Secret } from '../config/config.js';

// Import Routes
import indexRouter from './routes/index.route.server.js'
import movieRouter from './routes/movies.route.server.js';
import authRouter from './routes/auth.route.server.js';

// import api Routes
import authAPIRouter from './routes/api/auth-api.route.server.js';
import moviesApiRouter from './routes/api/movies-api.route.server.js'

// Instantiate Express Application
const app = express();

// Complete the DB Configuration
mongoose.connect(MongoURI);
const db = mongoose.connection;

//Listen for connection success or error
db.on('open', () => console.log("Connected to MongoDB"));
db.on('error', () => console.log("Mongo Connection Error"));

// Set Up Middlewares

// Setup ViewEngine EJS
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false}));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname,'/client')));
app.use(express.static(path.join(__dirname,'../public')));

app.use(cors());

// Auth Step 4 - Setup Express Session
app.use(session({
    secret: Secret,
    saveUninitialized: false, 
    resave: false
}));

// Auth Step 5 -  Setup Flash
app.use(flash());

// Auth Step 6 - Initialize Passport and Session
app.use(passport.initialize());
app.use(passport.session());

// Auth Step 7 - Implementing the Auth Strategy
passport.use(User.createStrategy());

// Auth Step 8 - Setup serialization and deserialization
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//setup JWT Options
//where we will look for auth info - server to client & client to server - 
//http message with:
// 1) header(static info about client - an envelope) - checks token from http envelope
// 2)content(info shared btwn server & client)
let jwtOptions = {
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),       //to extract header token
    secretOrKey: Secret     //to encrypt token
}

//setup strategy - what to do when token returned (what to do if has id, if id is good, or if no or bad token returned)
let strategy = new JWTStrategy(jwtOptions, (jwt_payload, done) => {
    User.findById(jwt_payload.id)       //if user found in payload recieved from client, then return done, with no errors
    .then(user => {
        return done(null, user);        //then return done with no errors, and a user
    })
    .catch(err => {
        return done(err, false);     //else if error returned, return an error & no user
    });
});

passport.use(strategy);     //informing passport that we can also use this strategy

// Use Routes
app.use('/', indexRouter);
app.use('/', movieRouter);
app.use('/', authRouter);

//use API routes
app.use('/api/auth', authAPIRouter);
app.use('/api/movies', passport.authenticate('jwt', {session: false}), moviesApiRouter);

export default app;