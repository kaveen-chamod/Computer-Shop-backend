import express from "express";
import Student from "../Models/student.js";
import { getStudents, createStudent, deletestudent, putstudent } from "../controllers/studentcontroller.js";

const studentRouter = express.Router()

studentRouter.get("/",getStudents)

studentRouter.post("/",createStudent)

studentRouter.delete("/",deletestudent)

studentRouter.put("/",putstudent)

export default studentRouter
