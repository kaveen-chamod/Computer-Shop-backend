import { useState, useEffect } from "react";
import { BsChevronUp } from "react-icons/bs";
import { useLocation, useNavigate } from "react-router-dom";

import CreateOrder from "../components/createOrder"; 

export default function CheckoutPage() {
    const location = useLocation();
    const navigate = useNavigate();
    
   
    const [cart, setCart] = useState(location.state || []);

    // Calculate Grand Total efficiently
    const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    // Secure the page: Redirect if no state exists
    useEffect(() => {
        if (location.state == null) {
            navigate("/products");
        }
    }, [location.state, navigate]);

    if (!location.state) return null;

    return (
        <div className="w-full min-h-screen bg-gray-50 flex flex-col items-center p-4 lg:p-6 gap-4">
            <h1 className="text-3xl font-bold self-start max-w-4xl mx-auto w-full lg:w-[60%] mb-4">
                Checkout Summary
            </h1>
            
            {cart.map((item, index) => {
                return (
                    <div
                        key={item.productId || index}
                        className="lg:w-[60%] bg-white w-full max-w-4xl relative rounded-2xl border border-slate-100 shadow-lg hover:shadow-md lg:h-[150px] transition-shadow flex items-center p-2 lg:p-0 lg:overflow-hidden"
                    >
                        {/* Mobile Title - Pinned to top left */}
                        <h1 className="absolute top-[-10px] w-auto py-[2px] px-[8px] rounded-lg shadow-sm bg-white left-0 lg:hidden font-bold text-xs text-slate-600 truncate ">
                            {item.name}
                        </h1>

                        {/* Image & Mobile Unit Price Section */}
                        <div className="flex flex-col items-center lg:h-full">
                            <div className="aspect-square h-[80px] lg:h-full overflow-hidden rounded-lg lg:rounded-none">
                                <img 
                                    src={item.image} 
                                    alt={item.name}
                                    className="h-full w-full object-cover bg-gray-100" 
                                />
                            </div>
                            {/* Mobile-only Unit Prices */}
                            <div className="lg:hidden mt-1 text-center">
                                {item.labledPrice > item.price && (
                                    <p className="text-[9px] text-slate-400 line-through">
                                        LKR {item.labledPrice.toFixed(2)}
                                    </p>
                                )}
                                <p className="text-[10px] font-bold text-blue-800">
                                    LKR {item.price.toFixed(2)}
                                </p>
                            </div>
                        </div>

                        {/* Desktop Product Info Section (Hidden on Mobile) */}
                        <div className="hidden lg:flex flex-1 flex-col justify-center pl-6">
                            <div className="relative group">
                                <h1 className="text-xl font-bold text-slate-800">
                                    {item.name.length > 25 ? item.name.substring(0, 25) + "..." : item.name}
                                </h1>
                                <span className="absolute left-0 -bottom-8 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-xs py-1 px-2 rounded z-10 whitespace-nowrap">
                                    {item.name}
                                </span>
                            </div>
                            <p className="text-xs font-mono text-slate-400 mt-1 uppercase">
                                ID: {item.productId}
                            </p>
                            <div className="flex lg:flex-col items-center lg:items-start gap-2 mt-3">
                                {item.labledPrice > item.price && (
                                    <h2 className="text-sm text-slate-400 line-through decoration-amber-500/50">
                                        LKR {item.labledPrice.toFixed(2)}
                                    </h2>
                                )}
                                <h2 className="text-lg font-bold text-slate-900">
                                    LKR {item.price.toFixed(2)}
                                </h2>
                            </div>
                        </div>

                        {/* Controls & Subtotal Section */}
                        <div className="flex flex-1 items-center justify-between lg:justify-end lg:gap-12 px-4">
                            {/* Quantity Controls */}
                            <div className="w-12 h-24 flex flex-col justify-between items-center py-2 bg-white">
                                <button className="p-1 hover:text-accent transition-colors">
                                    <BsChevronUp
                                        className="text-lg cursor-pointer"
                                        onClick={() => {
                                            const copiedCart = [...cart];
                                            copiedCart[index].quantity += 1;
                                            setCart(copiedCart);
                                        }}
                                    />
                                </button>
                                <span className="text-lg font-bold w-8 text-center">{item.quantity}</span>
                                <button className="p-1 hover:text-accent transition-colors">
                                    <BsChevronUp
                                        className="rotate-180 cursor-pointer text-lg"
                                        onClick={() => {
                                            const copiedCart = [...cart];
                                            copiedCart[index].quantity -= 1;
                                            if (copiedCart[index].quantity < 1) {
                                                copiedCart.splice(index, 1);
                                            }
                                            setCart(copiedCart);
                                        }}
                                    />
                                </button>
                            </div>

                            {/* Total Price for Item */}
                            <div className="p-2 rounded-md text-right min-w-[100px] lg:min-w-[140px]">
                                <p className="text-[10px] lg:text-xs text-slate-500 uppercase font-bold leading-none">Total</p>
                                <div className="flex flex-col">
                                    <span className="text-xs lg:text-sm font-black text-slate-600">LKR</span>
                                    <span className="text-lg lg:text-2xl font-black text-slate-900 break-all leading-tight">
                                        {(item.price * item.quantity).toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}

            {/* Total and Order Now */}
            {cart.length > 0 && (
                <div className="w-full lg:w-[60%] max-w-4xl bg-white rounded-2xl border border-slate-100 shadow-xl flex flex-col sm:flex-row items-center justify-between p-6 lg:px-10 mt-4 mb-10 sticky bottom-4 z-20 gap-4">
                    <div>
                        <p className="text-sm text-slate-400 uppercase font-semibold">Grand Total</p>
                        <div className="flex items-baseline gap-2">
                            <span className="text-xl font-bold text-slate-500">LKR</span>
                            <span className="text-3xl lg:text-4xl font-black text-slate-900">
                                {cartTotal.toFixed(2)}
                            </span>
                        </div>
                    </div>

                    
                    <CreateOrder cart={cart} />
                    
                </div>
            )}

            {cart.length === 0 && (
                <div className="mt-20 text-slate-400 text-center">
                    <p className="text-xl">Your cart is empty</p>
                    <button 
                        onClick={() => navigate("/checkout")}
                        className="mt-4 text-slate-800 underline font-semibold cursor-pointer hover:text-slate-600"
                    >
                        Go back to shopping
                    </button>
                </div>
            )}
        </div>
    );
}