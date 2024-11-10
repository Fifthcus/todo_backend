"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
//Routes
const userRoutes_1 = __importDefault(require("./routers/userRoutes"));
const apiRoutes_1 = __importDefault(require("./routers/apiRoutes"));
const app = (0, express_1.default)();
const corsOptions = {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
};
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use("/user", userRoutes_1.default);
app.use("/api/v1", apiRoutes_1.default);
app.listen(process.env.PORT, () => console.log(`Server listening on port ${process.env.PORT}`));
