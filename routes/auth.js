import express from 'express';
import {  auth, userSignIn, userSignUp } from '../controller/auth.js';

const router = express.Router();

router.get("/",auth);
//createAnUser
router.post("/signup",userSignUp);
//UserSignIn
router.post("/signin",userSignIn);


export default router;