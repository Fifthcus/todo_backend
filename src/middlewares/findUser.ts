import { Request, Response, NextFunction } from "express";
import { getUserByEmail } from "../database/userQueries";

const findUser = async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;
    try {
        const user = await getUserByEmail(email);
        if(!user) return res.status(404).json({ message: "Account not found." });
        req.user = user;
        next();
    } catch(error) {
        next(error);
    }
}

export default findUser;