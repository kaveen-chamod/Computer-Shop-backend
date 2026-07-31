import User from "../Models/user.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import dotenv, { config } from "dotenv"
dotenv.config()


export async function createUser(req, res) {
    try {
        const existing = await User.findOne({ email: req.body.email })
        if (existing != null) {
            res.json({
                message: "User already exists"
            })
            return
        }
        const passwordHash = await bcrypt.hashSync(req.body.password,10)
        const newUser = new User({
            email: req.body.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            password: passwordHash
        })
        await newUser.save()
        res.json({
            message: "User created successfully"
        })
    } catch (err) {
        res.json({
            message: "Error creating user",
            error: err.message
        })
    }
}



export async function loginUser(req, res) {
    try {
    const email = req.body.email
    const password = req.body.password

    if(email == null || password == null){
        res.status(400).json({
            message: "Email and password are required"
        })
        return  
    }
    const user = await User.findOne({ email: email })

    if (user == null){
        res.status(404).json({
            message: "User not found"
        })
        return
    }
    const isPasswordValid = await bcrypt.compareSync(password, user.password)
    if (isPasswordValid) {
        const token = jwt.sign(
            {
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                isAdmin: user.isAdmin

            },
            process.env.JWT_KEY
        )

        res.json({
            message: "Login successful",token: token
        })
    } else {
        res.json({
            message: "Invalid password"
        })
    }}
    catch (err) {
        res.json({
            message: "Error logging in",
            error: err.message
        })
    }
}