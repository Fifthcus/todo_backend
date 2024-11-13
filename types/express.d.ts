import { Request } from "express";

interface UserObject {
    id: number;
    username: string;
    email: string;
    password: string;
    salt: string;
    jwtrefresh: string;
}

declare global {
    namespace Express {
        interface Request {
            user?: UserObject,
        }
    }
}