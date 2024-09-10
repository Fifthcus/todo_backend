import express from "express";
import {insertUser} from "../database/userQueries"

const userRoutes = express.Router();

userRoutes.post("/", async (req, res) => {
    const {username, email, password, salt, jwtrefresh} = req.body;
    try{
        await insertUser(username, email, password, salt, jwtrefresh);
    }catch(error){
        console.error(error);
    }
});

export default userRoutes;