import jwt from "jsonwebtoken"

interface UserObj {
    email: string
}

export const generate = (user: UserObj, ttl: string) => {
    return jwt.sign(user, process.env.SECRET_ACCESS_TOKEN!, {expiresIn: `${ttl}`});
}