import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Loader from "../components/loader";
import { FiShoppingBag, FiClock, FiCheckCircle, FiTruck, FiXCircle } from "react-icons/fi";
import getFormattedPrice from "../utils/priceFormatter";
import getFormattedDate from "../Utils/Date-Format";

export default function MyOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchMyOrders = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                toast.error("Please login to view your orders");
                setLoading(false);
                return;
            }

            const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://10.10.4.54:3000";

            const response = await axios.get(`${backendUrl}/api/orders/my-orders`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            
            // Array එක කෙළින්ම ආවත් හෝ orders key එකක් ඇතුළේ ආවත් safe එකේ කියවයි
            const data = Array.isArray(response.data) ? response.data : (response.data.orders || []);
            setOrders(data);
        } catch (error) {
            console.error("Fetch orders error:", error);
            const message = error.response?.data?.message || "Failed to load orders";
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyOrders();
    }, []);

    // Status Badge එක Admin දෙන ඕනෑම අගයකට ගැලපෙන පරිදි
    const getStatusBadge = (status) => {
        const currentStatus = status?.toLowerCase();

        switch (currentStatus) {
            case "completed":
            case "delivered":
                return (
                    <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-max">
                        <FiCheckCircle /> {status}
                    </span>
                );
            case "shipped":
                return (
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-max">
                        <FiTruck /> Shipped
                    </span>
                );
            case "cancelled":
            case "rejected":
                return (
                    <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-max">
                        <FiXCircle /> Cancelled
                    </span>
                );
            case "pending":
            default:
                return (
                    <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-max">
                        <FiClock /> {status || "Pending"}
                    </span>
                );
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
                    <span className="bg-blue-50 text-slate-800 px-4 py-2 rounded-xl font-bold text-sm shadow-sm">
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
                        {orders.map((order) => {
                            // Backend එකෙන් එන items හෝ orderedItems දෙකෙන්ම කියවා ගනී
                            const orderItems = order.items || order.orderedItems || [];
                            const orderTotal = order.totalAmount || order.total || 0;
                            const orderDate = order.date || order.createdAt;

                            return (
                                <div key={order._id || order.orderId} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row justify-between gap-6 transition-all hover:shadow-md">
                                    
                                    {/* Order Details */}
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-xs font-bold text-gray-400">Order ID: {order.orderId || order._id}</span>
                                            <span className="text-xs text-gray-500">
                                                {orderDate ? (getFormattedDate ? getFormattedDate(orderDate) : new Date(orderDate).toLocaleDateString()) : "N/A"}
                                            </span>
                                        </div>

                                        <div className="mb-4">
                                            {getStatusBadge(order.status)}
                                        </div>

                                        <div className="border-t border-gray-100 pt-3 mt-3">
                                            <h4 className="text-sm font-semibold text-slate-700 mb-2">Items:</h4>
                                            <div className="flex flex-col gap-2">
                                                {orderItems.map((item, index) => (
                                                    <div key={index} className="flex justify-between text-sm text-gray-600">
                                                        <span>{item.name} x {item.quantity}</span>
                                                        <span className="font-medium">
                                                            {getFormattedPrice ? getFormattedPrice(item.price * item.quantity) : `LKR ${item.price * item.quantity}`}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Order Summary */}
                                    <div className="w-full md:w-64 bg-gray-50 p-4 rounded-xl border border-gray-100 flex flex-col justify-between">
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Shipping Address</p>
                                            <p className="text-sm text-slate-700 font-medium mb-4">{order.address || "N/A"}</p>
                                        </div>

                                        <div className="border-t border-gray-200 pt-3">
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm font-bold text-slate-600">Total Amount:</span>
                                                <span className="text-lg font-extrabold text-slate-900">
                                                    {getFormattedPrice ? getFormattedPrice(orderTotal) : `LKR ${orderTotal}`}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            );
                        })}
                    </div>
                )}

            </div>
        </div>
    );
}