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

const mongoDBURI = process.env.MONGO_URI

mongoose.connect(mongoDBURI).then(
    ()=>{
        console.log("connected DB server Successfully")
    }
)

let app = express()
app.use(express.json())
app.use(authentication)
app.use("/student",studentRouter)
app.use("/user",userRouter)
app.use("/products",productRouter)

app.listen(3000,
    ()=>{console.log("server started successfully")}
)
