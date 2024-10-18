import User from '../models/user.model.js'
import bcrypt from 'bcryptjs'
import { generateTokenAndSetCookie } from '../lib/utils/generateToken.js'
export const signup = async (req, res) => {
   try {
    const {fullName, username, email, password} = req.body
    if(!fullName || !username || !email ||!password){
        return res.status(400).send({
            success : false,
            message: "User not fond"
        })
    }
    const existingUser = await User.findOne({username})
    if(existingUser) {
        return res.status(401).json({error: "User name is already taken"})
    }
    const existingEmail = await User.findOne({email})
    if(existingEmail) {
        return res.status(400).json({error: "Email is already taken"})
    }
    if (password.length < 6) {
        return res.status(400).json({ error: "Password must be at least 6 characters long" });
    }
    
    const salt  = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(password, salt)

    const newUser = new User({
        fullName,
        username,
        email,
        password: hashPassword
    })

    if(newUser){
        generateTokenAndSetCookie(newUser._id, res)
        await newUser.save()

        res.status(201).json({
            _id: newUser._id,
            fullName: newUser.fullName,
            username: newUser.username,
            email: newUser.email,
            follwers: newUser.followers,
            profileImge: newUser.profileImg,
            coverImg: newUser.coverImg,
        })
    } else{
        res.status(400).json({error: "Invalid user data"})
    }


   } catch (err) {
    console.log("Error in protectRoute middleware", err.message);
    res.status(500).json({error: "Invalid Server Error" })
   }
}
export const login = async (req, res) => {
    try {
        const {username, password} = req.body;
        const user = await User.findOne({username})
        const isPasswordCorrect = await bcrypt.compare(password, user?.password || "")

        if (!user || !isPasswordCorrect) {
            return res.status(400).json({error: "Invalid username or password"})
        }
        generateTokenAndSetCookie(user._id, res)

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            username: user.username,
            email: user.email,
            follwers: user.followers,
            profileImge: user.profileImg,
            coverImg: user.coverImg,
        })
    } catch (err) {
        console.log("Error in Login controller", err.message);
    res.status(500).json({error: "Invalid Login Error" })
    }
}
export const logout = async (req, res) => {
    try {
        res.cookie('jwt', "", {maxAge:0})
        res.status(200).json({message: 'logged out successfully'})
    } catch (err) {
        console.log("Error in Login controller", err.message);
    res.status(500).json({error: "Invalid Login Error" })
    }
} 

export const getMe = async (req,res) => {
    try {
        const user = await User.findById(req.user._id).select("-password")
        res.status(200).json(user)
    } catch (error) {
        console.log("Error in protectRoute middleware", err.message);
    res.status(500).json({error: "Invalid Server Error" })
    }   
}