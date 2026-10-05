import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";

import studentRouter from "./routers/studentRouter.js";
import userRouter from "./routers/userRouter.js";
import productRouter from "./routers/productRouter.js";
import orderRouter from "./routers/orderRouter.js";
import authentication from "./middlewares/Authentication.js";

dotenv.config();

const mongoDBURI = process.env.MONGO_URI;
const PORT = process.env.PORT || 3000;

const app = express();
app.set("trust proxy", 1);

// 1. Security & global middlewares
app.use(
    helmet({
        crossOriginResourcePolicy: { policy: "cross-origin" },
    })
);

// CLIENT_URLS = "https://your-app.vercel.app,http://localhost:5173" (optional)
// Set nathnam okkoma origin allow wenawa
const allowedOrigins = (process.env.CLIENT_URLS || "")
    .split(",")
    .map((o) => o.trim().replace(/\/$/, ""))
    .filter(Boolean);

app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
                return callback(null, true);
            }
            return callback(new Error("Not allowed by CORS"));
        },
        credentials: true,
    })
);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    message: "Too many requests from this IP, please try again later.",
    validate: { xForwardedForHeader: false },
});
app.use("/api/", limiter);

// Health check (Render eke wake karanna / test karanna)
app.get("/", (req, res) => res.send("API is running"));

// 2. Public routes
app.use("/api/user", userRouter);
app.use("/api/products", productRouter);

// 3. Authentication middleware
app.use(authentication);

// 4. Protected routes
app.use("/api/student", studentRouter);
app.use("/api/orders", orderRouter);

// 5. DB connect, then start server
mongoose
    .connect(mongoDBURI)
    .then(() => {
        console.log("Connected DB server Successfully");
        app.listen(PORT, "0.0.0.0", () => {
            console.log(`Server started successfully on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error("Database connection failed:", error);
        process.exit(1);
    });