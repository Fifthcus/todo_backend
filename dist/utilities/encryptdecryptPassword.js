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
exports.decrypt = exports.encrypt = void 0;
const crypto_1 = __importDefault(require("crypto"));
const encrypt = (password) => __awaiter(void 0, void 0, void 0, function* () {
    const salt = crypto_1.default.randomBytes(64).toString("hex");
    const hashedPassword = yield crypto_1.default.pbkdf2Sync(password, salt, 100000, 64, "sha256").toString("hex");
    return { hashedPassword, salt };
});
exports.encrypt = encrypt;
const decrypt = (alreadyHashedPassword, password, salt) => __awaiter(void 0, void 0, void 0, function* () {
    const hashedPassword = yield crypto_1.default.pbkdf2Sync(password, salt, 100000, 64, "sha256").toString("hex");
    return alreadyHashedPassword === hashedPassword;
});
exports.decrypt = decrypt;
