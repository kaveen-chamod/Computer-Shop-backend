import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function UserData() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [selectedOption, setSelectedOption] = useState("me");

    useEffect(() => {
        const token = localStorage.getItem("token");
        
        if (token) {
            try {
                // Token එක decode කර ඒකෙ තියෙන දත්ත (firstName) ලබා ගැනීම
                const payloadBase64 = token.split('.')[1];
                const decodedJson = atob(payloadBase64);
                const decodedUser = JSON.parse(decodedJson);
                
                setUser(decodedUser);
            } catch (error) {
                console.error("Token decode error:", error);
                setUser(null);
            }
        } else {
            setUser(null);
        }
    }, []);

    return (
        <div>
            {user ? (
                <div className="flex items-center">
                    <img 
    src={localStorage.getItem("profilePic") || user?.image || "/profile-picture.png"} 
    className="w-10 h-10 rounded-full inline-block mr-2 object-cover border-2 border-primary/20 shadow-sm" 
    alt="profile" 
/>
                    <select
                        className="bg-transparent border-none outline-none inline-block cursor-pointer text-primary font-bold appearance-none"
                        value={selectedOption}
                        onChange={(e) => {
                            const val = e.target.value;
                            setSelectedOption(val);
                            
                            if (val === "settings") {
                                navigate("/setting");
                            } else if (val === "my-orders") {
                                navigate("/my-orders"); 
                            } else if (val === "logout") {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("profilePic"); // ⚠️ මේ පේළිය අලුතින් දාන්න
    setUser(null);
    navigate("/login");
}
                            
                            setTimeout(() => setSelectedOption("me"), 100);
                        }}
                    >
                        <option value="me" className="bg-white text-primary font-bold">{user.firstName || "User"}</option>
                        <option value="settings" className="bg-white text-primary font-bold">Settings</option>
                        <option value="my-orders" className="bg-white text-primary font-bold">My Orders</option>
                        <option value="logout" className="bg-white text-red-500 font-bold">Logout</option>
                    </select>
                </div>
            ) : (
                <div className="flex items-center gap-2">
                    <Link to="/signin" className="text-primary hover:text-gray-400 font-bold transition">Login</Link>
                    <span className="text-primary/50 font-bold">|</span>
                    <Link to="/signup" className="text-primary hover:text-gray-400 font-bold transition">Register</Link>
                </div>
            )}
        </div>
    );
}