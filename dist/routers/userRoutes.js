"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userQueries_1 = require("../database/userQueries");
const encryptDecryptPassword_1 = require("../utilities/encryptDecryptPassword");
const auth_1 = require("../utilities/auth");
const userRoutes = express_1.default.Router();
//Sign In
/* userRoutes.post("/signin", async (req, res) => {
    const {username, email, password, salt, jwtrefresh} = req.body;
    const hashPassword = encrypt(password);
    try{
        await insertUser(username, email, password, salt, jwtrefresh);
    }catch(error){
        console.error(error);
    }
}); */
//Sign Up
userRoutes.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.headers);
}));
userRoutes.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, password } = req.body;
    const hashPassword = yield (0, encryptDecryptPassword_1.encrypt)(password);
    try {
        const jwtToken = (0, auth_1.generate)({ email }, "10m");
        const jwtRefreshToken = (0, auth_1.generate)({ email }, "24h");
        yield (0, userQueries_1.insertUser)(username, email, hashPassword.hashedPassword, hashPassword.salt, jwtRefreshToken);
        res.cookie("userAuth", jwtToken, { httpOnly: true });
        res.cookie("userAuthRefresh", jwtRefreshToken, { httpOnly: true });
        return res.status(201).json({ username, email });
    }
    catch (error) {
        if (error.code === "23505") {
            return res.status(400).json({ message: "Account already exist." });
        }
        return res.status(400).json({ message: "Error creating account." });
    }
}));
exports.default = userRoutes;
