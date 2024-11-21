import { verify, fetchClaims } from "../utilities/auth";
import { Request, Response, NextFunction } from "express";

const isJWTValid = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userAuth = req.cookies.userAuth;
        if(!userAuth) {
            return res.status(401);
        };
        if(!await verify(userAuth, process.env.SECRET_ACCESS_TOKEN!)){
            if(req.body.persist){
                const email = fetchClaims(userAuth);
                req.body.email = email;
            }
            next();
        } else {
            res.status(401);
        }
    } catch(error) {
        console.error(error);
        next(error);
    }
}

export default isJWTValid;