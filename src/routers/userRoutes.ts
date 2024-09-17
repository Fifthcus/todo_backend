import express from "express";
import {getUserByEmail, insertUser} from "../database/userQueries"
import {encrypt, decrypt} from "../utilities/encryptDecryptPassword"
import {generate} from "../utilities/auth"

const userRoutes = express.Router();

//Sign In
userRoutes.post("/signin", async (req, res) => {
    const {email, password} = req.body;
    try{
        //Search for user in database, and if not return error.
        const user = await getUserByEmail(email);
        if(!user){
            return res.status(404).json({message: "Account does not exist."});
        }
        if(user){
            return res.status(200).json({message: "Signing in."});
        }
    }catch(error){
        console.error(error);
        return res.status(500).json({message: "An unknown error occured."});
    }
});

//Sign Up
userRoutes.post("/singup", async (req, res) => {
    const {username, email, password} = req.body;
    const hashPassword = await encrypt(password);
    try{
        const jwtToken = generate({email}, "10m");
        const jwtRefreshToken = generate({email}, "24h");
        await insertUser(username, email, hashPassword.hashedPassword, hashPassword.salt, jwtRefreshToken);
        res.cookie("userAuth", jwtToken, {httpOnly: true});
        res.cookie("userAuthRefresh", jwtRefreshToken, {httpOnly: true});
        return res.status(201).json({username, email});
    }catch(error: any){
        if(error.code === "23505"){
            return res.status(400).json({message: "Account already exist."});
        }
        return res.status(400).json({message: "Error creating account."});
    }
});

export default userRoutes;