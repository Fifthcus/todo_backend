import express from "express";
import {insertUser} from "../database/userQueries"
import {encrypt, decrypt} from "../utilities/encryptDecryptPassword"
import {generate} from "../utilities/auth"

const userRoutes = express.Router();

//Sign In example code.
/* userRoutes.post("/signin", async (req, res) => {
    const {username, email, password, salt, jwtrefresh} = req.body;
    const hashPassword = encrypt(password);
    try{
        await insertUser(username, email, password, salt, jwtrefresh);
    }catch(error){
        console.error(error);
    }
}); */

//Sign In
userRoutes.get("/", async (req, res) => {
    console.log(req.headers);
});

//Sign Up
userRoutes.post("/", async (req, res) => {
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