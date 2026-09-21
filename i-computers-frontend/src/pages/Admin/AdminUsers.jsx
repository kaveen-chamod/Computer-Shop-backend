import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FiTrash2, FiSlash, FiCheckCircle, FiShield, FiUser, FiSearch } from "react-icons/fi";

export default function AdminUser() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("customers"); 
    // අලුත්: Search Query සඳහා State එකක්
    const [searchQuery, setSearchQuery] = useState("");

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(import.meta.env.VITE_BACKEND_URL + "/api/user", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setUsers(response.data.users || response.data);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to fetch users");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDeleteUser = async (id) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;
        try {
            const token = localStorage.getItem("token");
            await axios.delete(import.meta.env.VITE_BACKEND_URL + `/api/user/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success("User deleted successfully");
            fetchUsers();
        } catch (error) {
            toast.error("Failed to delete user");
        }
    };

    const handleToggleBlock = async (id, currentStatus) => {
        try {
            const token = localStorage.getItem("token");
            const action = currentStatus ? "unblock" : "block";
            await axios.put(import.meta.env.VITE_BACKEND_URL + `/api/user/${action}/${id}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success(`User ${action}ed successfully`);
            fetchUsers();
        } catch (error) {
            toast.error("Failed to change user status");
        }
    };

    const handleToggleAdmin = async (id, currentIsAdmin) => {
        const confirmMsg = currentIsAdmin 
            ? "Are you sure you want to remove Admin rights from this user?" 
            : "Are you sure you want to make this user an Admin?";
            
        if (!window.confirm(confirmMsg)) return;

        try {
            const token = localStorage.getItem("token");
            await axios.put(import.meta.env.VITE_BACKEND_URL + `/api/user/toggle-admin/${id}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success(currentIsAdmin ? "Admin rights removed" : "User promoted to Admin");
            fetchUsers();
        } catch (error) {
            toast.error("Failed to update user role");
        }
    };

    if (loading) {
        return <div className="w-full h-full flex justify-center items-center text-xl font-bold text-gray-400">Loading Users...</div>;
    }

    // Active Tab සහ Search Query එක මත Users ලාව පෙරහන් (Filter) කිරීම
    const displayedUsers = users.filter(user => {
        const matchesTab = activeTab === "admins" ? user.isAdmin : !user.isAdmin;
        
        const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
        const email = user.email.toLowerCase();
        const query = searchQuery.toLowerCase();

        const matchesSearch = fullName.includes(query) || email.includes(query);

        return matchesTab && matchesSearch;
    });

    return (
        <div className="w-full">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
                <h1 className="text-2xl font-bold text-slate-800">Manage Users</h1>
                <span className="bg-blue-100 text-blue-700 px-4 py-1 rounded-full font-semibold text-sm self-start md:self-auto">
                    Total Users: {users.length}
                </span>
            </div>

            {/* Tabs සහ Search Bar එක එකම පේළියක පෙන්වීමට */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6 border-b border-gray-200 pb-4">
                <div className="flex gap-4">
                    <button 
                        onClick={() => setActiveTab("customers")}
                        className={`pb-2 px-4 font-bold text-lg transition-colors flex items-center gap-2 ${activeTab === "customers" ? "text-primary border-b-2 border-primary" : "text-gray-400 hover:text-gray-600"}`}
                    >
                        <FiUser /> Customers ({users.filter(u => !u.isAdmin).length})
                    </button>
                    <button 
                        onClick={() => setActiveTab("admins")}
                        className={`pb-2 px-4 font-bold text-lg transition-colors flex items-center gap-2 ${activeTab === "admins" ? "text-primary border-b-2 border-primary" : "text-gray-400 hover:text-gray-600"}`}
                    >
                        <FiShield /> Admins ({users.filter(u => u.isAdmin).length})
                    </button>
                </div>

                {/* අලුත්: Search Bar එක */}
                <div className="relative w-full md:w-[300px]">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                        <FiSearch />
                    </span>
                    <input 
                        type="text"
                        placeholder="Search by name or email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full h-11 pl-10 pr-4 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                    />
                </div>
            </div>

            <div className="overflow-x-auto bg-white rounded-xl border border-gray-100">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 text-gray-600 text-sm border-b border-gray-100">
                            <th className="p-4 font-semibold">Profile</th>
                            <th className="p-4 font-semibold">Name</th>
                            <th className="p-4 font-semibold">Email</th>
                            <th className="p-4 font-semibold">Role</th>
                            <th className="p-4 font-semibold">Status</th>
                            <th className="p-4 font-semibold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {displayedUsers.map((user) => (
                            <tr key={user._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                <td className="p-4">
                                    <img 
                                        src={user.image || "/profile-picture.png"} 
                                        alt={user.firstName} 
                                        className="w-10 h-10 rounded-full object-cover border border-gray-200"
                                    />
                                </td>
                                <td className="p-4 font-medium text-slate-700">
                                    {user.firstName} {user.lastName}
                                </td>
                                <td className="p-4 text-gray-500">{user.email}</td>
                                <td className="p-4">
                                    {user.isAdmin ? (
                                        <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs font-bold">Admin</span>
                                    ) : (
                                        <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-bold">Customer</span>
                                    )}
                                </td>
                                <td className="p-4">
                                    {user.isBlocked ? (
                                        <span className="text-red-500 font-bold flex items-center gap-1 text-sm"><FiSlash /> Blocked</span>
                                    ) : (
                                        <span className="text-green-500 font-bold flex items-center gap-1 text-sm"><FiCheckCircle /> Active</span>
                                    )}
                                </td>
                                <td className="p-4 flex justify-end gap-3">
                                    <button 
                                        onClick={() => handleToggleAdmin(user._id, user.isAdmin)}
                                        className={`p-2 rounded-lg transition-colors ${user.isAdmin ? "bg-purple-100 text-purple-600 hover:bg-purple-200" : "bg-blue-100 text-blue-600 hover:bg-blue-200"}`}
                                        title={user.isAdmin ? "Remove Admin Role" : "Make Admin"}
                                    >
                                        <FiShield />
                                    </button>

                                    {!user.isAdmin && ( 
                                        <button 
                                            onClick={() => handleToggleBlock(user._id, user.isBlocked)}
                                            className={`p-2 rounded-lg transition-colors ${user.isBlocked ? "bg-green-100 text-green-600 hover:bg-green-200" : "bg-orange-100 text-orange-600 hover:bg-orange-200"}`}
                                            title={user.isBlocked ? "Unblock User" : "Block User"}
                                        >
                                            {user.isBlocked ? <FiCheckCircle /> : <FiSlash />}
                                        </button>
                                    )}
                                    
                                    {!user.isAdmin && ( 
                                        <button 
                                            onClick={() => handleDeleteUser(user._id)}
                                            className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                                            title="Delete User"
                                        >
                                            <FiTrash2 />
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                        
                        {displayedUsers.length === 0 && (
                            <tr>
                                <td colSpan="6" className="p-8 text-center text-gray-500 font-medium">
                                    No users found matching your search.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}