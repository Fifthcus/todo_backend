import express from "express";
import {getUserByEmail, insertUser, updateUserJwtRefresh} from "../database/userQueries"
import {encrypt, decrypt} from "../utilities/encryptDecryptPassword"
import {generate, verify} from "../utilities/auth"

const userRoutes = express.Router();

//Sign In
userRoutes.post("/signin", async (req, res) => {
    const {email, password} = req.body;
    try{
        //Search for user in database, and if not return error.
        const user = await getUserByEmail(email);
        const returnedUserObj = {id: user.id, username: user.username, email: user.email};
        if(!user){
            return res.status(404).json({message: "Account does not exist."});
        }
        if(user){
            //Compare password with hashed password.
            if(await decrypt(user.password, password, user.salt)){
                const jwtToken = generate({email}, process.env.SECRET_ACCESS_TOKEN!, "15m");
                let jwtRefreshToken = user.jwtrefresh;
                //Generates new refresh token and updates users records in the database.
                if(await verify(user.jwtrefresh, process.env.SECRET_REFRESH_TOKEN!)){
                    jwtRefreshToken = generate({email}, process.env.SECRET_REFRESH_TOKEN!, "30d");
                    await updateUserJwtRefresh(user.id, jwtRefreshToken);
                }
                res.cookie("userAuthRefresh", jwtRefreshToken, {httpOnly: true});
                return res.status(200).json({message: "Signing in.", returnedUserObj});
            }
        }
    }catch(error){
        console.error(error);
        return res.status(500).json({message: "An unknown error occured."});
    }
});

//Sign Up

userRoutes.post("/signup", async (req, res) => {
    const {username, email, password} = req.body;
    const hashPassword = await encrypt(password);
    try{
        const jwtToken = generate({email}, process.env.SECRET_ACCESS_TOKEN!, "15");
        const jwtRefreshToken = generate({email}, process.env.SECRET_REFRESH_TOKEN!, "30d");
        await insertUser(username, email, hashPassword.hashedPassword, hashPassword.salt, jwtRefreshToken);
        const user = await getUserByEmail(email);
        const returnedUserObj = {id: user.id, username: user.username, email: user.email};
        res.cookie("userAuth", jwtToken, {httpOnly: true});
        res.cookie("userAuthRefresh", jwtRefreshToken, {httpOnly: true});
        return res.status(201).json({message: "Signing In.", user: returnedUserObj});
    }catch(error: any){
        console.log(error);
        if(error.code === "23505"){
            return res.status(400).json({message: "Account already exist."});
        }
        return res.status(500).json({message: "Error creating account."});
    }
});

export default userRoutes;