import { generateToken } from "../lib/utils.js";
import User from "../models/user.models.js";
import bcrypt from 'bcryptjs'

export const signup = async(req, res)=>{
    const {fulName, email,password} = req.body;
    try {
        if(!fulName || !email || !password){
            return res.status(400).json({message:'All fields are required'})
        }

        if(password.length<6){
            return res.status(400).json({message:"Password must be at least 6 characters"})
        }

        const user = await User.findOne({email})

        if(user) return res.status(400).json({message: "Email already exists"});

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password,salt)

        const newUser = new User({
            fulName,
            email,
            password: hashedPassword
        })

        if(newUser){
            // generate jwt token here
            generateToken(newUser._id,res)
            await newUser.save();

            res.status(201).json({
                _id: newUser._id,
                fulName: newUser.fulName,
                email: newUser.email,
                profilePic: newUser.profilePic,
            })

        }else{
            res.status(400).json({message:"Invalid User Data"})
        }

    } catch (error) {
        console.log("Error in signup controller", error.message);
        res.status(500).json({message:"Internal server error"})
    }
}

export const login  = async(req, res)=>{
    const {email, password}=req.body;
    try {
        const user = await User.findOne({email})  
        if(!user){
            return res.status(400).json({message:'Invalid credentials'})
        }     

        const isPasswordCorrect = await bcrypt.compare(password,user.password)
        if(!isPasswordCorrect){
            return res.status(400).json({message: "Invalid credentials"})
        } 

        generateToken(user._id,res)
        res.status(200).json({
            _id: user._id,
            fulName: user.fulName,
            email: user.email,
            profilePic: user.profilePic,
        })

    } catch (error) {
        console.log("Error in login controller", error.message);
        res.status(500).json({message:"Internal Server Error"})
        
    }
}

export const logout =(req, res)=>{
    try {
        res.cookie("jwt","",{maxAge:0})
        res.status(200).json({message: "Logout Successfully"})
    } catch (error) {
        console.log("Error in logout controller",error.message)
        res.status(500).json({message:"Internal Server Error"})
    }
}

export const updateProfile = async (req, res)=>{
    
}