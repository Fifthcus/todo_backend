import jwt from "jsonwebtoken"

interface UserObj {
    email: string
}

export const generate = (user: UserObj, secret_token: string, ttl: string) => {
    return jwt.sign({...user, iat: Math.floor(Date.now() / 1000)}, secret_token, {expiresIn: `${ttl}`});
}

export const verify = async (token: string, secret_token: string) => {
    let isExpired: true | false = false;
    await jwt.verify(token, secret_token, (err) => {
        console.log(err);
        if(err){
            if(err.message === "jwt expired"){
                isExpired = true;
                return isExpired;
            }
        }
    });
    return isExpired;
}