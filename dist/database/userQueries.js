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
exports.updateUserJwtRefresh = exports.getUserByEmail = exports.insertUser = void 0;
const pool_1 = __importDefault(require("./pool"));
/* async function insertUsername(username, password) {
    await db.query("INSERT INTO accounts (username, password) VALUES ($1, $2)", [username, password]);
} */
const insertUser = (username, email, password, salt, jwtrefresh) => __awaiter(void 0, void 0, void 0, function* () {
    yield pool_1.default.query("INSERT INTO users (username, email, password, salt, jwtrefresh) VALUES ($1, $2, $3, $4, $5)", [username, email, password, salt, jwtrefresh]);
});
exports.insertUser = insertUser;
//For signing in.
const getUserByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const { rows } = yield pool_1.default.query("SELECT * FROM users WHERE email = ($1)", [email]);
    return rows[0];
});
exports.getUserByEmail = getUserByEmail;
const updateUserJwtRefresh = (id, jwtrefresh) => __awaiter(void 0, void 0, void 0, function* () {
    yield pool_1.default.query("UPDATE users SET jwtrefresh = ($1) WHERE id = ($2)", [jwtrefresh, id]);
});
exports.updateUserJwtRefresh = updateUserJwtRefresh;
