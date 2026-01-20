import express from 'express'

const router = express.Router();

router.get('/signup', (req, res)=>{
    res.send("signup endpoint")
})
router.get('/login', (req, res)=>{
    res.send("login endpoint")
})
router.get('/update', (req, res)=>{
    res.send("updete endpoint")
})

export default router;