import {useState} from "react";
import toast from "react-hot-toast";
import {Link , useNavigate} from "react-router-dom";
import { FaGoogle } from "react-icons/fa";
import axios from "axios";

export default function LoginPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)

    async function handleLogin() {
      setLoading(true)
      try{
        const res = await axios.post("http://localhost:3000/api/user/login", 
          {
          email : email,
          password : password
          }
        )
        console.log(res)
        toast.success("Login successful!")
        localStorage.setItem("token", res.data.token)
        if (res.data.isAdmin) {
          navigate("/admin")
        } else {
          navigate("/")
        }
      } catch (error) {
        console.error("Login error:", error)
        toast.error(error.response?.data?.message || "Login failed. Please try again.")
      } finally {
        setLoading(false)
      }
    }
    
    return (
      <div className="w-full h-full bg-[url('/login-by.jpg')] bg-cover bg-no-repeat flex flex-col md:flex-row">
        <div className = "w-100 h-125 m-auto bg-white/20 backdrop-blur-md border border-white/30 shadow-2xl shadow-black/40 rounded-2xl flex flex-col justify-center items-center p-8">
        <h1 className = "text-4xl font-bold text-white mb-8 text-center drop-shadow-lg">Login</h1>
        <div className = "w-full">
          <label className = "text-white text-lg flex items-center gap-2">Email:</label>
          <input className = "w-full h-10 rounded-md px-2 border border-white"
          placeholder = "Enter your email"
          onChange={(e) => { 
          setEmail(e.target.value)} }/>
        </div>
        <div className = "w-full mt-5">
          <label className = "text-white text-lg flex items-center gap-2">Password :</label>
          <input className = "w-full h-10 rounded-md px-2 border border-white"
          type = "password"
          placeholder = "Enter your password"
          onChange={(e) => {
          setPassword(e.target.value)} }/>
        </div>
        <div >
        <p className = "w-full mb-3 text-white text-right italic">Forgot password ? <Link to="/forgot-password" className="text-blue-900 hover:underline">Click here</Link></p>
        <button className = "w-full h-12.5 bg-blue-500 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300" onClick={handleLogin} disabled={loading}>
          {loading ? "Loading..." : "Login"}
        </button>
        <p className = "w-full h-2 text-white text-center italic mt-4">Don't have an account ? <Link to="/signup" className="text-blue-900 hover:underline">Sign up</Link></p>
<button className="w-full h-12.5 bg-white text-gray-700 font-semibold rounded-md flex items-center justify-center gap-3 shadow-md hover:bg-gray-100 hover:shadow-lg transition duration-300 mt-5">
<FaGoogle className="text-red-500 text-xl" />Sign Up with Google
</button>
</div>
      </div>
      </div>
    )
  }
