import jwt from "jsonwebtoken"
import dotenv, { config } from "dotenv"
dotenv.config()

    export default function authentication(req, res, next)
    {
        const header = req.header("Authorization")
        if (header == null){
            next()
        }else{
            const token = header.replace("Bearer ","")

            jwt.verify(token,process.env.JWT_KEY,
                (err,decoded)=>{
                    if(decoded == null){
                        res.status(401).json({
                            message: "Invalid token"
                        })
                    }else{
                        req.user = decoded
                        next()
                    }
                }
            )}
        }