import {Request,Response,NextFunction} from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

export const check=async(req:Request,res:Response,next:NextFunction)=>{
    const token = req.cookies.token;
    const secret:any=process.env.secret;
    try{
        jwt.verify(token,secret);
        next();
    }catch(err){
        res.status(401).send("Invalid token");
    }
}
