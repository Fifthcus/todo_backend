import express from "express";
import {insertUser} from "../database/userQueries"
import {encrypt, decrypt} from "../utilities/encryptDecryptPassword"

const userRoutes = express.Router();

//Sign In
/* userRoutes.post("/signin", async (req, res) => {
    const {username, email, password, salt, jwtrefresh} = req.body;
    const hashPassword = encrypt(password);
    try{
        await insertUser(username, email, password, salt, jwtrefresh);
    }catch(error){
        console.error(error);
    }
}); */

//Sign Up
userRoutes.post("/signup", async (req, res) => {
    const {username, email, password, jwtrefresh} = req.body;
    const hashPassword = await encrypt(password);
    try{
        await insertUser(username, email, hashPassword.hashedPassword, hashPassword.salt, jwtrefresh);
        res.status(201).json({username, email});
    }catch(error: any){
        console.error(error);
        if(error.code === "23505"){
            res.status(400).json({message: "Account already exist."});
        }
        res.status(400).json({message: "Error creating account."});
    }
});

export default userRoutes;