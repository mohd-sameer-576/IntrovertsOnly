import User from '../models/User.js';
import bcrypt from 'bcryptjs'
import {generateToken } from '../lib/util.js'
export const signup = async (req, res)=>{
    const {fullname, email,password} = req.body
    try {
        if(!fullname || !email || !password){
            return res.status(400).json({message:"all fields are required"})
        }
        if(password.length < 6){
            return res.status(400).json({message:"password should be atleast 6 characters"})
            
        }
        const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!validEmail.test(email)){
            return res.status(400).json({message:"Please enter a valid email"})
            
        }
        const user = await User.findOne({email})
        if(user){
            return res.status(400).json({message:"Email already exists"})
        }
        const salt = await bcrypt.genSalt(10) // for saving password in bcrypted from
        const hashedPassword = await bcrypt.hash(password,salt)
        const newUser = new User({
            fullname,email,password:hashedPassword
        })
        if(newUser){
            generateToken(newUser._id, res)
            await newUser.save()

            res.status(201).json({
                _id:newUser._id,
                fullname:newUser.fullname,
                email:newUser.email,
                profilePic:newUser.profilePic,

            })

        }else{
            res.status(400).json({message:"invalid user data"})
        }
    } catch (error) {
        console.log("error in signup controle:", error)
        res.status(500).json({message:"something went wrong"})
    }
}