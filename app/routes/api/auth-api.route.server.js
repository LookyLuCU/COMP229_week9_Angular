import { Router } from 'express';
import { processLogin, processLogout, processRegistration } from '../../controllers/api/auth-api.controller.server.js';

const router = Router();

//copied from auth.router.server.js - similar setup
//procesing only, dont need to display, note: changed methodName slightly
router.post('/login', processLogin); 
router.post('/register', processRegistration);   
router.get('/logout', processLogout);

export default router;