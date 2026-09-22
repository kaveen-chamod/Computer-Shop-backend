import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { getCart } from "../utils/cart";
import getFormattedPrice from "../utils/priceFormatter";
import { FiShoppingBag, FiTruck, FiPhone, FiMapPin, FiUser } from "react-icons/fi";

export default function CheckOut() {
    const location = useLocation();
    const navigate = useNavigate();

    
    const checkoutItems = location.state && Array.isArray(location.state) && location.state.length > 0 
        ? location.state 
        : getCart();

    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [loading, setLoading] = useState(false);

    // calculate total amount for the checkout items
    const totalAmount = checkoutItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

    const handleConfirmOrder = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("Please login to complete your order");
            navigate("/signin");
            return;
        }

        if (checkoutItems.length === 0) {
            toast.error("No items found to checkout");
            return;
        }

        if (!address.trim() || !phone.trim()) {
            toast.error("Please provide both shipping address and phone number");
            return;
        }

        setLoading(true);
        const loadingToast = toast.loading("Placing your order...");

        try {
            const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://10.10.4.54:3000";

            // Build the payload for the order items
            const payloadItems = checkoutItems.map((item) => ({
                productId: item.productId || item.productid,
                quantity: item.quantity
            }));

            const response = await axios.post(
                `${backendUrl}/api/orders`,
                {
                    name: name.trim(),
                    address: address.trim(),
                    phone: phone.trim(),
                    items: payloadItems
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            toast.success("Order Placed Successfully!", { id: loadingToast });

            // Clear the cart from localStorage if the order was placed successfully
            if (!location.state) {
                localStorage.removeItem("cart");
            }

            // after successful order placement, navigate to the My Orders page
            navigate("/my-orders");

        } catch (error) {
            console.error("Order submit error:", error);
            const errorMsg = error.response?.data?.message || "Failed to place order";
            toast.error(errorMsg, { id: loadingToast });
        } finally {
            setLoading(false);
        }
    };

    if (checkoutItems.length === 0) {
        return (
            <div className="w-full min-h-[calc(100vh-100px)] flex flex-col justify-center items-center p-6 bg-gray-50">
                <FiShoppingBag className="text-6xl text-slate-300 mb-4" />
                <h2 className="text-2xl font-bold text-slate-700 mb-2">No Items to Checkout</h2>
                <p className="text-slate-500 mb-6">Your checkout list is empty.</p>
                <button
                    onClick={() => navigate("/")}
                    className="bg-slate-900 text-white font-bold px-6 py-3 rounded-xl hover:bg-slate-800 transition"
                >
                    Continue Shopping
                </button>
            </div>
        );
    }

    return (
        <div className="w-full min-h-[calc(100vh-100px)] bg-gray-50 py-10 px-4 lg:px-12 flex justify-center">
            <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* LEFT SIDE: Shipping Information Form */}
                <div className="lg:col-span-7 bg-white rounded-3xl p-6 lg:p-8 border border-slate-100 shadow-xl">
                    <h2 className="text-2xl font-black text-slate-900 mb-2 flex items-center gap-2">
                        <FiTruck className="text-blue-600" /> Shipping Information
                    </h2>
                    <p className="text-sm text-slate-500 mb-6">Enter destination address and contact information</p>

                    <form onSubmit={handleConfirmOrder} className="flex flex-col gap-5">
                        
                        {/* Recipient Name */}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                <FiUser className="text-slate-400" /> Recipient Name <span className="text-xs text-slate-400 font-normal">(Optional)</span>
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Leave blank to use profile name"
                                className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:border-slate-800 focus:ring-1 focus:ring-slate-800 outline-none transition text-sm text-slate-800"
                            />
                        </div>

                        {/* Phone Number */}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                <FiPhone className="text-slate-400" /> Phone Number <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="07XXXXXXXX"
                                required
                                className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:border-slate-800 focus:ring-1 focus:ring-slate-800 outline-none transition text-sm text-slate-800"
                            />
                        </div>

                        {/* Shipping Address */}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                <FiMapPin className="text-slate-400" /> Full Delivery Address <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                rows="3"
                                placeholder="Street Address, City, Postal Code"
                                required
                                className="w-full p-4 rounded-xl border border-slate-200 focus:border-slate-800 focus:ring-1 focus:ring-slate-800 outline-none transition text-sm text-slate-800 resize-none"
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#071952] hover:bg-[#051138] text-white font-bold py-4 rounded-xl mt-4 transition-colors cursor-pointer shadow-lg disabled:bg-slate-400 disabled:cursor-not-allowed"
                        >
                            {loading ? "Placing Order..." : "Confirm & Place Order"}
                        </button>
                    </form>
                </div>

                {/* RIGHT SIDE: Order Summary */}
                <div className="lg:col-span-5 bg-white rounded-3xl p-6 lg:p-8 border border-slate-100 shadow-xl flex flex-col gap-6">
                    <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-4">
                        Order Summary
                    </h2>

                    {/* Items List */}
                    <div className="flex flex-col gap-4 max-h-[350px] overflow-y-auto pr-2">
                        {checkoutItems.map((item, index) => (
                            <div key={index} className="flex items-center gap-4 border-b border-slate-50 pb-3">
                                <img
                                    src={item.image || "/default.png"}
                                    alt={item.name}
                                    className="w-16 h-16 object-cover rounded-xl bg-slate-100 border border-slate-100"
                                />
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-bold text-slate-800 truncate">{item.name}</h4>
                                    <p className="text-xs text-slate-500 mt-1">
                                        Quantity: <span className="font-semibold text-slate-700">{item.quantity}</span>
                                    </p>
                                    <p className="text-sm font-extrabold text-slate-900 mt-1">
                                        {getFormattedPrice(item.price * item.quantity)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pricing Breakdowns */}
                    <div className="border-t border-slate-100 pt-4 flex flex-col gap-2">
                        <div className="flex justify-between text-sm text-slate-600">
                            <span>Subtotal</span>
                            <span className="font-semibold text-slate-800">{getFormattedPrice(totalAmount)}</span>
                        </div>
                        <div className="flex justify-between text-sm text-slate-600">
                            <span>Shipping</span>
                            <span className="font-semibold text-emerald-600">FREE</span>
                        </div>
                        <div className="flex justify-between text-lg font-black text-slate-900 border-t border-slate-100 pt-3 mt-2">
                            <span>Total Payable</span>
                            <span className="text-blue-900">{getFormattedPrice(totalAmount)}</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}