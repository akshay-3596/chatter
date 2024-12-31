import jwt from "jsonwebtoken"
import dotenv from 'dotenv'
dotenv.config()



export const generateToken =(userId, res)=>{

    const token = jwt.sign({userId}, process.env.JWT_SECRET,{
        expiresIn: '7d'
    })
console.log("Key",process.env.JWT_SECRET)
    res.cookie("jwt",token, {
        maxAge: 7*24*60*60*1000,   //ms
        httpOnly: true,          //prevent xss attacks cross-site scripting attacks
        sameSite: "strict",     //csrf attacks cross-site request forgery attacks
        secure:process.env.NODE_ENV !=='development'
    });

    return token;
};