import { useState } from "react";
import Modal from "react-modal";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function CreateOrder({ cart }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // Form States
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");
    
    const navigate = useNavigate();

    async function submitOrder() {
        const token = localStorage.getItem("token");
        
        if (!token) {
            toast.error("You must log in to place an order");
            navigate("/login");
            return;
        }

        if (!name || !address || !phone) {
            toast.error("Please fill in all shipping details.");
            return;
        }

        const orderItems = cart.map((item) => ({
            productId: item.productId,
            name: item.name,
            price: item.price,
            image: item.image,
            quantity: item.quantity
        }));

        axios.post(import.meta.env.VITE_BACKEND_URL + "/api/orders", {
            name: name,
            address: address,
            phone: phone,
            items: orderItems
        }, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        }).then(() => {
            toast.success("Order Placed Successfully");
            setIsModalOpen(false);
            navigate("/orders");
        }).catch(() => {
            toast.error("Error Placing Order");
        });
    }

    return (
        <>
            {/* Main Order Now Button (Rendered in Checkout Page) */}
            <button 
                className="w-full cursor-pointer sm:w-auto bg-slate-900 text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-slate-800 transition-all text-center active:scale-95 shadow-lg" 
                onClick={() => setIsModalOpen(true)}
            >
                Order Now
            </button>

            {/* Modal Popup */}
            <Modal
                isOpen={isModalOpen}
                onRequestClose={() => setIsModalOpen(false)}
                className="outline-none w-full max-w-md mx-auto mt-24 bg-white rounded-xl shadow-2xl overflow-hidden"
                overlayClassName="fixed inset-0 bg-black/60 flex items-start justify-center z-50 p-4"
                ariaHideApp={false}
            >
                <div className="p-8 relative">
                    {/* Close Button */}
                    <button 
                        onClick={() => setIsModalOpen(false)}
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 font-bold text-lg cursor-pointer"
                    >
                        X
                    </button>
                    
                    <h2 className="text-xl font-bold text-center mb-6 text-slate-800">
                        Enter Shipping Details
                    </h2>

                    <div className="flex flex-col gap-4">
                        <input
                            type="text"
                            placeholder="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm focus:outline-none focus:border-blue-800 focus:ring-1 focus:ring-blue-800"
                        />
                        <input
                            type="text"
                            placeholder="Delivery Address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm focus:outline-none focus:border-blue-800 focus:ring-1 focus:ring-blue-800"
                        />
                        <input
                            type="text"
                            placeholder="Phone Number"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm focus:outline-none focus:border-blue-800 focus:ring-1 focus:ring-blue-800"
                        />

                        <button 
                            onClick={() => {
                                submitOrder();
                                navigate("/my-orders");
                            }}
                            className="w-full bg-[#071952] hover:bg-[#051138] text-white font-bold py-3 rounded-md mt-4 transition-colors cursor-pointer shadow-md text-sm"
                        >
                            Confirm Order
                        </button>
                    </div>
                </div>
            </Modal>
        </>
    );
}