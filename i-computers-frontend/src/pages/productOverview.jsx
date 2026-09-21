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

                    <h1 className="text-4xl text-center sticky bg-white top-0 lg:hidden block font-semibold p-4 z-10 shadow-sm">
                        {product.name}
                    </h1>

                    {/* LEFT SIDE */}
                    <div className="lg:w-1/2 w-full lg:h-full lg:mt-3 flex">
                        <ImageSlider images={product.images || []} />
                    </div>

                    {/* RIGHT SIDE */}
                    <div className="lg:w-1/2 w-full lg:h-full p-10 flex flex-col gap-6">

                        <h1 className="text-4xl hidden lg:block font-bold">
                            {product.name}
                        </h1>

                        <h2 className="text-lg text-slate-600 font-medium">
                            
                            PRODUCT ID : {product.productid || product.productId}
                        </h2>

                        <h2 className="text-lg font-semibold text-accent flex items-center gap-2">
                            <CgChevronRight />
                            {product.category}
                        </h2>

                        
                        {altNames.length > 0 && (
                            <h3 className="text-md font-semibold text-secondary/80">
                                {altNames.join(" | ")}
                            </h3>
                        )}
                        
                        <p className="text-md text-justify p-3 text-secondary/90 bg-gray-50 rounded-lg max-h-[250px] overflow-y-auto">
                            {product.description}
                        </p>

                        <div className="w-full">
                            
                            {labledPrice > product.price && (
                                <h2 className="text-secondary/80 line-through decoration-amber-400 decoration-2 mr-2 text-lg">
                                    
                                    {getFormattedPrice(labledPrice)}
                                </h2>
                            )}

                            <h2 className="text-accent font-bold text-4xl mt-1">
                                
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
                                className="bg-accent text-white font-bold px-8 py-3 cursor-pointer rounded-lg hover:bg-accent/90 transition shadow-md"
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
                                className="border-2 border-accent text-accent font-bold px-8 py-3 rounded-lg hover:bg-accent cursor-pointer hover:text-white transition shadow-sm"
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