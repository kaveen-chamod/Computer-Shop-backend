import { Routes , Route } from "react-router-dom";
import { Link } from "react-router-dom";

import {useState} from "react";
import toast, { Toaster } from 'react-hot-toast';

import { SlUserFollowing } from "react-icons/sl";

export default function TestPage() {

    // const [score , setScore] = useState(50);
    // const[mood , setMood] = useState("😒");
    // const[isFollowed , setIsFollowed] = useState(false);

    // return (
    //     <div className = "w-full h-full bg-green-400 p-8 flex justify-center items-center">
    //         <div className = "w-[450px] h-[450px] bg-white p-5 m-12 flex items-center flex-col">
    //             <h1 className = "text-7xl font-bold">{score}</h1>
    //             <div className = "w-full h-[100px] flex justify-center items-center bg-blue-500 mt-[25px]">
    //                 <button className = "w-[100px] h-[50px] bg-red-500 text-white font-bold text-lg rounded-lg" onClick = {() => setScore(score + 1)}>Increase</button>
    //                 <button className = "w-[100px] h-[50px] bg-yellow-500 text-white font-bold text-lg rounded-lg ml-[25px]" onClick = {() => setScore(score - 1)}>Decrease</button>
    //             </div>
    //             <div className = "w-full h-[100px] flex justify-center items-center bg-blue-500 mt-[25px]">
    //                 <p className = "text-4xl" >{mood}</p>
    //                 <button className = "w-[100px] h-[50px] bg-red-500" onClick = {() => { toast.success("You are happy!"); setMood("😂")}}>Happy</button>
    //                 <button className = "w-[100px] h-[50px] bg-yellow-500 ml-[25px]" onClick = {() => { toast.error("You are sad!"); setMood("😓")}}>Sad</button>
    //                 <SlUserFollowing className ={isFollowed ? "text-[100px] text-red-600": "text-[100px] text-gray-600"} onClick={() => setIsFollowed(!isFollowed)}/>
    //                 </div>
    //             </div>
    //         </div>


    const [file,setFile] = useState(null);
    async function uploadFile(){
        const res = await MediaUpload(file);
        console.log(res);
    }
    return(
        <div ClassName = "w-full h-full flex justify-center items-center">
            <input type = "file" onChange={(e) => setFile(e.target.files[0])}/>
            <button onClick={uploadFile}className="bg-blue-600 text-white px-4 py-2 rounded">Upload</button>
        </div>
        
        
    )
}