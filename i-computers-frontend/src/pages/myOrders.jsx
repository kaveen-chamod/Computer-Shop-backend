import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Loader from "../components/loader";
import { FiShoppingBag, FiClock, FiCheckCircle, FiTruck, FiXCircle } from "react-icons/fi";

export default function MyOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchMyOrders = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                toast.error("Please login to view your orders");
                return;
            }

            // Backend එකෙන් අදාළ User ගේ Orders ලබාගැනීම
            const response = await axios.get(import.meta.env.VITE_BACKEND_URL + "/api/orders/my-orders", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setOrders(response.data.orders || response.data);
        } catch (error) {
            toast.error(response?.data?.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyOrders();
    }, []);

    // Order එකේ Status එක අනුව අදාළ පාට සහ අයිකන් ලබාදීමට
    const getStatusBadge = (status) => {
        switch (status?.toLowerCase()) {
            case "delivered":
                return <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-max"><FiCheckCircle /> Delivered</span>;
            case "shipped":
                return <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-max"><FiTruck /> Shipped</span>;
            case "cancelled":
                return <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-max"><FiXCircle /> Cancelled</span>;
            default:
                return <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-max"><FiClock /> Pending</span>;
        }
    };

    if (loading) {
        return (
            <div className="w-full min-h-[calc(100vh-100px)] flex justify-center items-center">
                <Loader />
            </div>
        );
    }

    return (
        <div className="w-full min-h-[calc(100vh-100px)] py-10 px-6 lg:px-16 bg-gray-50">
            <div className="max-w-5xl mx-auto">
                
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-800">My Orders</h1>
                        <p className="text-gray-500 text-sm mt-1">Track and view your order history</p>
                    </div>
                    <span className="bg-blue-50 text-primary px-4 py-2 rounded-xl font-bold text-sm shadow-sm">
                        Total Orders: {orders.length}
                    </span>
                </div>

                {orders.length === 0 ? (
                    <div className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center flex flex-col items-center justify-center">
                        <div className="text-5xl text-gray-300 mb-4">
                            <FiShoppingBag />
                        </div>
                        <h2 className="text-xl font-bold text-slate-700 mb-2">No orders found</h2>
                        <p className="text-gray-500 text-sm mb-6">You haven't placed any orders yet.</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-6">
                        {orders.map((order) => (
                            <div key={order._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row justify-between gap-6 transition-all hover:shadow-md">
                                
                                {/* Order Details */}
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-xs font-bold text-gray-400">Order ID: {order._id}</span>
                                        <span className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</span>
                                    </div>

                                    <div className="mb-4">
                                        {getStatusBadge(order.status)}
                                    </div>

                                    <div className="border-t border-gray-100 pt-3 mt-3">
                                        <h4 className="text-sm font-semibold text-slate-700 mb-2">Items:</h4>
                                        <div className="flex flex-col gap-2">
                                            {order.orderedItems?.map((item, index) => (
                                                <div key={index} className="flex justify-between text-sm text-gray-600">
                                                    <span>{item.name} x {item.quantity}</span>
                                                    <span className="font-medium">LKR {item.price * item.quantity}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Order Summary / Total */}
                                <div className="w-full md:w-64 bg-gray-50 p-4 rounded-xl border border-gray-100 flex flex-col justify-between">
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Shipping Address</p>
                                        <p className="text-sm text-slate-700 font-medium mb-4">{order.address || "N/A"}</p>
                                    </div>

                                    <div className="border-t border-gray-200 pt-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-bold text-slate-600">Total Amount:</span>
                                            <span className="text-lg font-extrabold text-primary">LKR {order.total || order.totalAmount}</span>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        ))}
                    </div>
                )}

            </div>
        </div>
    );
}