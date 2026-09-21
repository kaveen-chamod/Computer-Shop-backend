import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Loader from "../components/loader";
import ProductCard from "../components/productCard";
import { FiArrowRight, FiShield, FiTruck, FiHeadphones } from "react-icons/fi";

export default function HomeContent() {
    const [products, setProducts] = useState([]);
    const [loaded, setLoaded] = useState(false);

    // මුල් පිටුවට අවශ්‍ය නිෂ්පාදන (Products) Backend එකෙන් ලබාගැනීම
    useEffect(() => {
        axios.get(import.meta.env.VITE_BACKEND_URL + "/api/products")
            .then((response) => {
                // අවශ්‍ය නම් මුල් නිෂ්පාදන 8ක් පමණක් පෙන්වීමට .slice(0, 8) පාවිච්චි කළ හැක
                setProducts(response.data.slice(0, 8) || response.data);
                setLoaded(true);
            })
            .catch((error) => {
                console.error("Error fetching products:", error);
                setLoaded(true);
            });
    }, []);

    return (
        <div className="w-full min-h-[calc(100vh-100px)] pb-16">
            
            {/* --- HERO SECTION --- */}
            <div className="w-full bg-gradient-to-r from-slate-900 to-primary text-white py-16 px-6 lg:px-16 mb-12 flex flex-col md:flex-row items-center justify-between">
                <div className="max-w-xl mb-8 md:mb-0">
                    <span className="bg-white/10 text-blue-300 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                        Isuri Computers
                    </span>
                    <h1 className="text-4xl md:text-5xl font-extrabold mt-4 mb-4 leading-tight">
                        Upgrade Your Tech & Gaming Experience
                    </h1>
                    <p className="text-gray-300 text-base md:text-lg mb-8">
                        Explore the latest laptops, computer components, and accessories with the best quality and warranty.
                    </p>
                    <Link 
                        to="/products"
                        className="bg-white text-primary font-bold px-8 py-3 rounded-xl hover:bg-gray-100 transition-colors shadow-lg inline-flex items-center gap-2"
                    >
                        Explore Products <FiArrowRight />
                    </Link>
                </div>
                <div className="w-full md:w-1/2 flex justify-center">
                    <img 
                        src="/logo.png" 
                        alt="Isuri Computers" 
                        className="max-h-[250px] object-contain drop-shadow-2xl bg-white/5 p-6 rounded-3xl border border-white/10" 
                    />
                </div>
            </div>

            {/* --- FEATURES SECTION --- */}
            <div className="max-w-7xl mx-auto px-6 mb-16 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-4 bg-blue-50 text-primary rounded-xl text-2xl">
                        <FiTruck />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg text-slate-800">Islandwide Delivery</h3>
                        <p className="text-sm text-gray-500">Fast and secure delivery to your doorstep.</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-4 bg-blue-50 text-primary rounded-xl text-2xl">
                       <FiShield />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg text-slate-800">100% Genuine Products</h3>
                        <p className="text-sm text-gray-500">Official warranty and trusted brands.</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-4 bg-blue-50 text-primary rounded-xl text-2xl">
                        <FiHeadphones />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg text-slate-800">24/7 Customer Support</h3>
                        <p className="text-sm text-gray-500">Dedicated support for all your tech needs.</p>
                    </div>
                </div>
            </div>

            {/* --- FEATURED PRODUCTS SECTION --- */}
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-800">Featured Products</h2>
                    <Link to="/products" className="text-primary font-bold hover:underline flex items-center gap-1 text-sm md:text-base">
                        View All <FiArrowRight />
                    </Link>
                </div>

                {!loaded ? (
                    <div className="w-full h-[30vh] flex justify-center items-center">
                        <Loader />
                    </div>
                ) : (
                    <div className="w-full flex justify-center flex-row flex-wrap gap-6">
                        {products.length === 0 ? (
                            <div className="w-full text-center py-10">
                                <h2 className="text-lg text-gray-500 font-semibold">No products available at the moment.</h2>
                            </div>
                        ) : (
                            products.map((item) => {
                                return (
                                    <ProductCard
                                        key={item.productid || item.productId || item._id}
                                        product={item}
                                    />
                                );
                            })
                        )}
                    </div>
                )}
            </div>

        </div>
    );
}