import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

//Routes
import userRoutes from "./routers/userRoutes";
import apiRoutes from "./routers/apiRoutes";

const app = express();

const corsOptions = {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use("/user", userRoutes);
app.use("/api/v1", apiRoutes);

app.listen(process.env.PORT, () => console.log(`Server listening on port ${process.env.PORT}`));