import jwt from "jsonwebtoken"

export const generate = (email: string, secret_token: string, ttl: string) => {
    return jwt.sign({email, iat: Math.floor(Date.now() / 1000)}, secret_token, {expiresIn: `${ttl}`});
}

export const verify = async (token: string, secret_token: string) => {
    let isExpired: true | false = false;
    await jwt.verify(token, secret_token, (err) => {
        if(err){
            if(err.message === "jwt expired"){
                isExpired = true;
                return isExpired;
            }
        }
    });
    return isExpired;
}