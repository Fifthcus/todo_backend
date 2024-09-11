import crypto from "crypto";
export const encrypt = async (password: string) => {
    const salt = crypto.randomBytes(64).toString("hex");
    const hashedPassword = await crypto.pbkdf2Sync(password, salt, 100000, 64, "sha256").toString("hex");
    return {hashedPassword, salt};
}
export const decrypt = async (alreadyHashedPassword: string, password: string, salt: string) => {
    const hashedPassword = await crypto.pbkdf2Sync(password, salt, 100000, 64, "sha256").toString("hex");
    return alreadyHashedPassword === hashedPassword;
}