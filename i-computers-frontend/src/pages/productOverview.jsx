import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../components/loader";
import axios from "axios";
import ImageSlider from "../components/productimageSlideShow";
import { CgChevronRight } from "react-icons/cg";
import { addToCart } from "../utils/cart";
import AuthModal from "../components/authModal"; 

import getFormattedPrice from "../utils/priceFormatter"; 

export default function ProductOverview() {
    const navigate = useNavigate();
    const params = useParams();
    const [product, setProduct] = useState(null);
    const [status, setStatus] = useState("loading");

    const [showAuthModal, setShowAuthModal] = useState(false);

    useEffect(() => {
        if (status === "loading") {
            axios.get(import.meta.env.VITE_BACKEND_URL + "/api/products/" + params.productId)
                .then((response) => {
                    setProduct(response.data);
                    setStatus("success");
                })
                .catch(() => {
                    toast.error("Product Not Found");
                    setStatus("error");
                });
        }
    }, [status, params.productId]); 

    const checkLoginAndProceed = (action) => {
        const token = localStorage.getItem("token");
        if (token) {
            action(); 
        } else {
            setShowAuthModal(true); 
        }
    };

    const labledPrice = product?.labelledprice || product?.labledPrice || 0;
    const altNames = product?.altNames || product?.altname || [];

    return (
        <>
            <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
            
            {status === "loading" && (
                <div className="w-full h-[50vh] flex justify-center items-center">
                    <Loader />
                </div>
            )}

            {status === "error" && (
                <h1 className="text-center mt-10 text-2xl font-bold text-red-500">
                    Error Loading Product
                </h1>
            )}

            {status === "success" && product && (
                <div className="w-full min-h-[calc(100vh-100px)] flex lg:flex-row flex-col pb-10">

                    <h1 className="text-4xl text-center sticky bg-white top-0 lg:hidden block font-bold text-slate-800 p-4 z-10 shadow-sm">
                        {product.name}
                    </h1>

                    {/* LEFT SIDE */}
                    <div className="lg:w-1/2 w-full lg:h-full lg:mt-3 flex">
                        <ImageSlider images={product.images || []} />
                    </div>

                    {/* RIGHT SIDE */}
                    <div className="lg:w-1/2 w-full lg:h-full p-10 flex flex-col gap-6">

                        <h1 className="text-4xl hidden lg:block font-extrabold text-white tracking-tight">
                            {product.name}
                        </h1>

                        <h2 className="text-sm tracking-wider uppercase text-[#e1e5eb] font-semibold">
                            PRODUCT ID : {product.productid || product.productId}
                        </h2>

                        <h2 className="text-base font-bold text-blue-600 flex items-center gap-1">
                            <CgChevronRight className="text-lg" />
                            {product.category}
                        </h2>

                        {altNames.length > 0 && (
                            <h3 className="text-sm font-medium text-[#ced1d6]">
                                {altNames.join(" | ")}
                            </h3>
                        )}
                        
                        <p className="text-base leading-relaxed text-justify p-4 text-slate-700 bg-slate-100/80 border border-slate-200/60 rounded-xl max-h-[250px] overflow-y-auto">
                            {product.description}
                        </p>

                        <div className="w-full">
                            {labledPrice > product.price && (
                                <h2 className="text-slate-400 line-through decoration-rose-500 decoration-2 mr-2 text-lg font-medium">
                                    {getFormattedPrice(labledPrice)}
                                </h2>
                            )}

                            <h2 className="text-white font-black text-4xl mt-1">
                                {getFormattedPrice(product.price)}
                            </h2>
                        </div>

                        <div className="w-full flex justify-center lg:justify-start flex-row gap-4 mt-6">

                            <button
                                onClick={() => {
                                    checkLoginAndProceed(() => {
                                        addToCart(product, 1);
                                    });
                                }}
                                className="bg-white text-slate-800 border-2 border-slate-800 font-bold px-8 py-3 cursor-pointer rounded-lg hover:bg-slate-800 hover:text-white transition shadow-md"
                            >
                                Add to Cart
                            </button>

                            <button
                                onClick={() => {
                                    checkLoginAndProceed(() => {
                                        navigate("/checkout", {
                                            state: [{
                                                productId: product.productid || product.productId,
                                                name: product.name,
                                                price: product.price,
                                                labledPrice: labledPrice,
                                                image: product.images?.[0] || "/default.png",
                                                quantity: 1
                                            }]
                                        });
                                    });
                                }}
                                className="bg-white text-black font-bold px-8 py-3 rounded-lg hover:bg-slate-900 hover:text-white cursor-pointer transition shadow-md"
                            >
                                Buy Now
                            </button>

                        </div>
                    </div>
                </div>
            )}
        </>
    );
}