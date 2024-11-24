import { verify, generate, fetchClaims } from "../utilities/auth";
import { Request, Response, NextFunction } from "express";
import findUser from "./findUser";

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
        }
        else if(await verify(userAuth, process.env.SECRET_ACCESS_TOKEN!)) {
            findUser(req, res, next);
            const refreshToken = req.user?.jwtrefresh;
            if(!await verify(refreshToken!, process.env.SECRET_REFRESH_TOKEN!)){
                const jwtToken = generate(req.user?.email!, process.env.SECRET_ACCESS_TOKEN!, "15m");
                res.cookie("userAuth", jwtToken, { httpOnly: true });
                res.send(200).json({ message: "Reauthenticated" });
            }
            else if(await verify(refreshToken!, process.env.SECRET_REFRESH_TOKEN!)){
                res.send(403).json({ message: "Please authenticate again." });
            }
        }
    } catch(error) {
        console.error(error);
        next(error);
    }
}

export default isJWTValid;