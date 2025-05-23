import express, { Request, Response } from "express";
import { getUserByEmail, insertUser, updateUserJwtRefresh } from "../database/userQueries";
import { encrypt, decrypt } from "../utilities/encryptDecryptPassword";
import { generate, verify } from "../utilities/auth";
import isJWTValid from "../middlewares/isJWTValid";
import findUser from "../middlewares/findUser";

const userRoutes = express.Router();

//Persist user login
userRoutes.post("/persist", isJWTValid, findUser, (req: Request, res: Response) => {
    const user = req.user;
    if(!user) return null;
    const returnUserObjectToFrontend = { id: user.id, username: user.username, email: user.email };
    res.status(200).json({ user: returnUserObjectToFrontend });
});
//Prevent user from being signed out while using app

//Sign In
userRoutes.post("/signin", findUser, async (req, res) => {
    const { password } = req.body;
    const user = req.user;
    if(!user) return null;
    const returnUserObjectToFrontend = { id: user.id, username: user.username, email: user.email };
    try{
        if(user){
            //Compare password with hashed password.
            if(await decrypt(user.password, password, user.salt)){
                const jwtToken = generate(user.email, process.env.SECRET_ACCESS_TOKEN!, "15m");
                //Generates new refresh token and updates users records in the database.
                if(await verify(user.jwtrefresh, process.env.SECRET_REFRESH_TOKEN!)){
                    const jwtRefreshToken = generate(user.email, process.env.SECRET_REFRESH_TOKEN!, "30d");
                    await updateUserJwtRefresh(user.id, jwtRefreshToken);
                }
                res.cookie("userAuth", jwtToken, { httpOnly: true });
                return res.status(200).json({ message: "Signed in.", user: returnUserObjectToFrontend });
            } else {
                res.status(500).json({ message: "Username or password incorreect." });
            }
        }
    }catch(error){
        console.error(error);
        return res.status(500).json({ message: "An unknown error occurred." });
    }
});

//Sign Up
userRoutes.post("/signup", async (req, res) => {
    const { username, email, password } = req.body;
    const hashPassword = await encrypt(password);
    try{
        const jwtToken = generate(email, process.env.SECRET_ACCESS_TOKEN!, "15");
        const jwtRefreshToken = generate(email, process.env.SECRET_REFRESH_TOKEN!, "30d");
        await insertUser(username, email, hashPassword.hashedPassword, hashPassword.salt, jwtRefreshToken);
        const user = await getUserByEmail(email);
        const returnedUserObj = { id: user.id, username: user.username, email: user.email };
        res.cookie("userAuth", jwtToken, {httpOnly: true});
        return res.status(201).json({ message: "Account Created.", user: returnedUserObj });
    }catch(error: any){
        console.log(error);
        if(error.code === "23505"){
            return res.status(400).json({ message: "Account already exist." });
        }
        return res.status(500).json({ message: "Error creating account." });
    }
});

//Logout
userRoutes.post("/logout", (req, res) => {
    res.clearCookie('userAuth');
    res.clearCookie('userAuthRefresh');
    res.status(200).json({ message: "Successfully logged out." });
});

export default userRoutes;