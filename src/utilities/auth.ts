import jwt from "jsonwebtoken"

interface DecodedUserAuthToken {
    email?: string,
    iat?: number,
    exp?: number
}

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

export const fetchClaims = (userAuth: string) => {
    const decodedUserAuth = jwt.decode(userAuth);
    const { email } = <DecodedUserAuthToken>decodedUserAuth;
    return email;
}