import express from "express"
import mongoose from "mongoose"
import Student from "./Models/student.js"
import studentRouter from "./routers/studentRouter.js"
import userRouter from "./routers/userRouter.js"
import jwt from "jsonwebtoken"
import authentication from "./middlewares/Authentication.js"
import productRouter from "./routers/productRouter.js"
import dotenv from "dotenv"
dotenv.config()
import cors from "cors"
import orderRouter from "./routers/orderRouter.js"

const mongoDBURI = process.env.MONGO_URI

mongoose.connect(mongoDBURI).then(
    ()=>{
        console.log("connected DB server Successfully")
    }
)

let app = express()
app.use(cors())
app.use(express.json())
app.use(authentication)
app.use("/api/student",studentRouter)
app.use("/api/user",userRouter)
app.use("/api/products",productRouter)
app.use("/api/orders", orderRouter);

app.listen(3000,
    ()=>{console.log("server started successfully")}
)
