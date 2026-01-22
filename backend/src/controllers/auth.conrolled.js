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
            const saveUser = await newUser.save()
            generateToken(saveUser._id, res)
            await newUser.save()

            res.status(201).json({
                _id:saveUser._id,
                fullname:saveUser.fullname,
                email:saveUser.email,
                profilePic:saveUser.profilePic,

            })

        }else{
            res.status(400).json({message:"invalid user data"})
        }
    } catch (error) {
        console.log("error in signup controle:", error)
        res.status(500).json({message:"something went wrong"})
    }
}

export const login = async (req,res) =>{
    const {email,password} = req.body
    try {
        const user = await User.findOne({email})
        if(!user) return res.status(400).json({message:"Invalid Credentials"})
        
        const isPasswordCorrect = await bcrypt.compare(password,user.password)
        if(!isPasswordCorrect) return res.status(400).json({message:"Invalid Credentials"})

        generateToken(user._id,res)

        res.status(201).json({
                _id:user._id,
                fullname:user.fullname,
                email:user.email,
                profilePic:user.profilePic,

            })
    } catch (error) { 
        console.error("Error in login controller:", error)
        res.status({message:"internal server error"})
    }
}
export const logout =  (_,res) =>{
    res.cookie("jwt","",{maxAge:0})
    res.status(200).json({message:"Logged out successfully"})
}