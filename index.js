import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";

// Routers and Middlewares
import Student from "./Models/student.js"; 
import studentRouter from "./routers/studentRouter.js";
import userRouter from "./routers/userRouter.js";
import productRouter from "./routers/productRouter.js";
import orderRouter from "./routers/orderRouter.js";
import authentication from "./middlewares/Authentication.js";

dotenv.config();
const mongoDBURI = process.env.MONGO_URI;

const app = express();

// 1. Security & Global Utility Middlewares (Must be at the top)
app.use(helmet()); // Helmet helps secure Express apps by setting various HTTP headers

app.use(cors({
    origin: [
        "http://localhost:5173", 
        "https://computershopfrontend1-git-main-team-1-b89d.vercel.app",
        "https://computershopfrontend1-2hfx7u0jk-team-1-b89d.vercel.app" // අලුත් Vercel ලින්ක් එක මෙතැනට එකතු කර ඇත
    ],
    credentials: true
}));

// Body parsers
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Brute-force සහ DDoS ප්‍රහාර වැළැක්වීම සඳහා Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: "Too many requests from this IP, please try again later."
});
app.use("/api/", limiter);

// 2. Public Routes 
app.use("/api/user", userRouter);
app.use("/api/products", productRouter);

// 3. Authentication Middleware 
app.use(authentication);

// 4. Protected Routes
app.use("/api/student", studentRouter);
app.use("/api/orders", orderRouter);

// 5. Database Connection with Error Handling
mongoose.connect(mongoDBURI)
    .then(() => {
        console.log("Connected DB server Successfully");
    })
    .catch((error) => {
        console.error("Database connection failed:", error);
    });

// 6. Start Server
app.listen(3000, () => {
    console.log("Server started successfully on port 3000");
});