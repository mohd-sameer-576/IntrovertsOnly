import User from '../models/User.js';
import Message from '../models/Message.js';
import bcrypt from 'bcryptjs'
import {generateToken } from '../lib/util.js'
import cloudinary from '../lib/cloudinary.js';
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
    if(!email || !password){
        return res.status(400).json({message:"all fields are required"})
    }
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
export const updateprofile = async (req,res) =>{
    const {fullname, email, password, profilePic} = req.body
    try {
        if(!profilePic){
            return res.status(400).json({message:"Profile picture is required"})
        }
        const userId = req.user._id
        
        // Upload to Cloudinary with options
        const uploadResponse = await cloudinary.uploader.upload(profilePic, {
            folder: "chat-app/profiles",
            resource_type: "auto",
            quality: "auto",
            fetch_format: "auto"
        })
        
        // Prepare update object
        const updateData = {
            fullname,
            email,
            profilePic: uploadResponse.secure_url
        }
        
        // Only hash and update password if provided
        if(password && password.trim()){
            const salt = await bcrypt.genSalt(10)
            updateData.password = await bcrypt.hash(password, salt)
        }
        
        const updatedUser = await User.findByIdAndUpdate(userId, updateData, {new:true}).select('-password')
        res.status(200).json({message:"Profile updated successfully", user:updatedUser})
    } catch (error) {
        console.error("Error in updateprofile controller:", error)
        res.status(500).json({message:"Failed to upload image: " + error.message})
    }
}
export const deleteAccount = async (req,res) =>{
    try {
        const userId = req.user._id
        
        // Delete all messages where user is sender or receiver
        await Message.deleteMany({
            $or: [
                { sender: userId },
                { receiverId: userId }
            ]
        })
        
        // Delete user from database
        await User.findByIdAndDelete(userId)
        
        // Clear the JWT cookie
        res.cookie("jwt", "", {maxAge: 0})
        
        res.status(200).json({message:"Account and all associated data deleted successfully"})
    } catch (error) {
        console.error("Error in deleteAccount controller:", error)
        res.status(500).json({message:"Failed to delete account: " + error.message})
    }
}