import express from 'express'
import { signup, login ,logout, updateprofile, deleteAccount } from '../controllers/auth.conrolled.js';
import { protectRoute} from '../middleware/auth.middleware.js'
import { arkjetMiddleware } from '../controllers/arkjet.middleware.js';
const router = express.Router();

router.use(arkjetMiddleware)

router.post('/signup', signup)
router.post('/login' ,login)
router.post('/logout', logout)
router.put('/update-profile', protectRoute, updateprofile)
router.delete('/delete-account', protectRoute, deleteAccount)
router.get('/check', protectRoute, (req,res) =>{
    res.status(200).json({user: req.user})
})

export default router;