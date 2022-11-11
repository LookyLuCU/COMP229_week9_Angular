import { Router } from "express";
import {Add, Edit, Get, GetList, Delete } from "../../controllers/api/movies-api.controller.server.js"

const router = Router();

// REST API VERBS 
// creating a "rest" API = will be using HTTP verbs as they were meant to be

//when we implement an API, a way to connect to our app (API) in a way that follows HTTP standards
//using already defined HTTP verbs:
// POST (Create - 404 Not found, 409 conflict (resource already exists))
// GET (Read -  200 OK, 404 not found if ID not found or invalid)
// PUT (Update/replace - 200 OK, 204 NO content, 404 not found if ID not found or invalid)
// PATCH (update/modify - 200 OK, 404 not found if ID not found or invalid)
// DELETE(delete - 200 OK, 404 not found if ID not found or invalid)

//this router file will be using REST API becuase we chose to use stnd HTTP verbs (but we could have named them anything)

router.get('/list', GetList);
router.get('/:id', Get);
router.post('/add', Add);
router.put('/edit/:id', Edit);
router.delete('/delete/:id', Delete);


export default router;