import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";
import axios from "axios";
import { useGoogleLogin } from "@react-oauth/google";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // Google Login Handler
  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setGoogleLoading(true);
      try {
        // get user info from Google API
        const userInfo = await axios.get(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: {
              Authorization: `Bearer ${tokenResponse.access_token}`,
            },
          }
        );

        // Send user info to backend for login or registration
        const res = await axios.post(
          import.meta.env.VITE_BACKEND_URL + "/api/user/google-login",
          {
            email: userInfo.data.email,
            firstName: userInfo.data.given_name || "User",
            lastName: userInfo.data.family_name || "",
            image: userInfo.data.picture,
          }
        );

        toast.success("Google Login successful!");

        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        if (res.data.user && res.data.user.image) {
          localStorage.setItem("profilePic", res.data.user.image);
        }

        if (res.data.user?.isAdmin || res.data.isAdmin) {
          navigate("/admin");
        } else {
          navigate("/");
        }
      } catch (error) {
        console.error("Google login error:", error);
        toast.error(error.response?.data?.message || "Google login failed.");
      } finally {
        setGoogleLoading(false);
      }
    },
    onError: (error) => {
      console.error("Google Auth Failed:", error);
      toast.error("Google Login was unsuccessful");
    },
  });

  // Normal Email/Password Login Handler
  async function handleLogin() {
    setLoading(true);
    try {
      const res = await axios.post(
        import.meta.env.VITE_BACKEND_URL + "/api/user/login",
        {
          email: email,
          password: password,
        }
      );

      toast.success("Login successful!");

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      if (res.data.user && res.data.user.image) {
        localStorage.setItem("profilePic", res.data.user.image);
      }

      if (res.data.isAdmin || res.data.user?.isAdmin) {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full h-full bg-[url('/login-by.jpg')] bg-cover bg-no-repeat flex flex-col md:flex-row min-h-screen">
      <div className="w-[90%] max-w-[400px] m-auto bg-white/20 backdrop-blur-md border border-white/30 shadow-2xl shadow-black/40 rounded-2xl flex flex-col justify-center items-center p-8">
        <h1 className="text-4xl font-bold text-white mb-8 text-center drop-shadow-lg">
          Login
        </h1>

        <div className="w-full">
          <label className="text-white text-lg flex items-center gap-2">Email:</label>
          <input
            className="w-full h-10 rounded-md px-2 border border-white text-black outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="w-full mt-5">
          <label className="text-white text-lg flex items-center gap-2">Password:</label>
          <input
            className="w-full h-10 rounded-md px-2 border border-white text-black outline-none focus:ring-2 focus:ring-blue-400"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="w-full">
          <p className="w-full my-3 text-white text-right italic text-sm">
            Forgot password ?{" "}
            <Link to="/forgot-password" className="text-blue-300 hover:underline">
              Click here
            </Link>
          </p>

          {/* Normal Login Button */}
          <button
            type="button"
            onClick={handleLogin}
            disabled={loading}
            className="w-full h-12 bg-blue-500 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300 disabled:bg-blue-300"
          >
            {loading ? "Loading..." : "Login"}
          </button>

          <p className="w-full text-white text-center italic mt-4 text-sm">
            Don't have an account ?{" "}
            <Link to="/signup" className="text-blue-300 hover:underline">
              Sign up
            </Link>
          </p>

          {/* Google Login Button */}
          <button
            type="button"
            onClick={() => loginWithGoogle()}
            disabled={googleLoading}
            className="w-full h-12 bg-white text-gray-700 font-semibold rounded-md flex items-center justify-center gap-3 shadow-md hover:bg-gray-100 hover:shadow-lg transition duration-300 mt-5 disabled:opacity-70 cursor-pointer"
          >
            <FaGoogle className="text-red-500 text-xl" />
            <span>{googleLoading ? "Signing in..." : "Sign in with Google"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}