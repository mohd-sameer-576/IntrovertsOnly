import express from 'express'
import { signup } from '../controllers/auth.conrolled.js';

const router = express.Router();

router.post('/signup', signup)
router.get('/login', (req, res)=>{
    res.send("login endpoint")
})
router.get('/update', (req, res)=>{
    res.send("updete endpoint")
})

export default router;