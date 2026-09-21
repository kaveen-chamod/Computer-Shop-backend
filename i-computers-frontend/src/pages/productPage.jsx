import { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../components/loader";
import ProductCard from "../components/productCard";

export default function ProductPage() {
    const [products, setProducts] = useState([]);
    const [loaded, setLoaded] = useState(false);
    const [query, setQuery] = useState("");

    useEffect(() => {
        if (!loaded) {
            axios.get(import.meta.env.VITE_BACKEND_URL + "/api/products")
                .then((response) => {
                    setProducts(response.data);
                    setLoaded(true);
                })
                .catch((error) => {
                    console.error("Error fetching products:", error);
                    setLoaded(true); 
                });
        }
    }, [loaded]);

    return (
        <div className="w-full min-h-[calc(100vh-100px)] pb-16">
            {!loaded ? (
                <div className="w-full h-[50vh] flex justify-center items-center">
                    <Loader />
                </div>
            ) : (
                <div className="w-full flex justify-center flex-row flex-wrap">

                    {/* Search Bar - විනිවිද පෙනෙන (Transparent/Blur) Background එක සහිතව */}
                    <div className="w-full h-[100px] sticky top-0 bg-white/80 backdrop-blur-md flex justify-center items-center mb-4 z-40">
                        <input
                            type="text"
                            placeholder="Search Products ..."
                            className="w-1/2 px-4 py-3 bg-white border border-gray-200 shadow-sm rounded-xl outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm"
                            value={query}
                            onChange={async (e) => {
                                const searchValue = e.target.value;
                                setQuery(searchValue);

                                if (searchValue === "") {
                                    setLoaded(false);
                                    try {
                                        const response = await axios.get(import.meta.env.VITE_BACKEND_URL + "/api/products");
                                        setProducts(response.data);
                                    } catch (error) {
                                        console.error("Error fetching products:", error);
                                    } finally {
                                        setLoaded(true);
                                    }
                                } else {
                                    try {
                                        const response = await axios.get(
                                            import.meta.env.VITE_BACKEND_URL + "/api/products/search/" + encodeURIComponent(searchValue)
                                        );
                                        setProducts(response.data);
                                    } catch (error) {
                                        console.error("Error searching products:", error);
                                        setProducts([]); 
                                    }
                                }
                            }}
                        />
                    </div>

                    {/* Product Cards Container */}
                    <div className="w-full flex justify-center flex-row flex-wrap gap-4 px-10">
                        {products.length === 0 ? (
                            <div className="w-full text-center mt-10">
                                <h2 className="text-xl text-gray-500 font-semibold">No products found matching your search.</h2>
                            </div>
                        ) : (
                            products.map((item) => (
                                <ProductCard
                                    key={item.productid || item.productId || item._id}
                                    product={item}
                                />
                            ))
                        )}
                    </div>

                </div>
            )}
        </div>
    );
}