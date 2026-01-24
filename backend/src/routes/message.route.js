import express from 'express'
import {getAllUsers,getMessagesByUserId,sendMessage,getFriends} from '../controllers/message.controller.js'
import { protectRoute } from '../middleware/auth.middleware.js';
import { arkjetMiddleware } from '../controllers/arkjet.middleware.js';
const router = express.Router();

router.use(arkjetMiddleware, protectRoute);
router.get("/allUsers",getAllUsers)
router.get("/friends", getFriends)
router.get("/:id", getMessagesByUserId)
router.post("/send/:id", sendMessage)

export default router