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
userRoutes.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, password, jwtrefresh } = req.body;
    const hashPassword = yield (0, encryptDecryptPassword_1.encrypt)(password);
    try {
        yield (0, userQueries_1.insertUser)(username, email, hashPassword.hashedPassword, hashPassword.salt, jwtrefresh);
        res.status(201).json({ username, email });
    }
    catch (error) {
        console.error(error);
        if (error.code === "23505") {
            res.status(400).json({ message: "Account already exist." });
        }
        res.status(400).json({ message: "Error creating account." });
    }
}));
exports.default = userRoutes;
