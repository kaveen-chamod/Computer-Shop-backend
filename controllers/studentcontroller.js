import Student from "../Models/student.js"
import user from "../Models/user.js"

export function getStudents(req,res){
    Student.find().then(
        (result)=>{
            res.json(result)
        }
    )
    }

export function createStudent (req,res){
    if (req.user == null){
        res.status(401).json({
            message: "Unauthorized"
        })
        return
    }
    if(req.user.isAdmin == false){
        res.status(403).json({
            message: "Only admin can create student"
        })
        return
    }
    const newStudent = new Student (req.body)
    newStudent.save().then(()=>{
        res.json({
            message: "student created successfully"
        })
    })
}

export function deletestudent(req,res){
    console.log("delete request received")
}

export function putstudent(req,res){
    console.log("put request received")
}


// user functions


