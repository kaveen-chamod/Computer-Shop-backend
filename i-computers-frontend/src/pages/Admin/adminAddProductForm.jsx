import React, { useState } from "react";
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { MediaUpload } from "../../utils/MediaUpload";

export default function AdminAddProductForm(props){ 

   
    const [productID, setProductID] = useState("");
    const [productName, setProductName] = useState("");
    const [altNames, setAltNames] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("0");
    const [labledPrice, setLabledPrice] = useState("0");
    const [files, setFiles] = useState([]); 
    const [isAvailable, setIsAvailable] = useState(true);
    const [category, setCategory] = useState("laptops");
    const [stock, setStock] = useState(0);
    const [brand, setBrand] = useState("");
    const [model, setModel] = useState("");
    const [loading, setLoading] = useState(false); 

    const navigate = useNavigate(); 

    async function addProduct(){
        if (!productID || !productName || !price || !category || !model) {
            toast.error("Please fill all required fields");
            return;
        }

        const Token = localStorage.getItem("token");
        if (!Token) {
            toast.error("You are not logged in");
            navigate("/signin");
            return;
        }

        setLoading(true);
        const loadingToast = toast.loading("Adding product...");
        
        try {
            const imagepromises = [];
            for (let i = 0; i < files.length; i++) {
                const promise = MediaUpload(files[i]);
                imagepromises.push(promise);
            }
            const uploadedImages = await Promise.all(imagepromises);
            const altNameInarray = altNames.split(",").map((name) => name.trim());

            await axios.post(import.meta.env.VITE_BACKEND_URL + "/api/products", {
                productId: productID, 
                name: productName,
                altNames: altNameInarray,
                description: description,
                price: Number(price),
                labledPrice: Number(labledPrice),
                images: uploadedImages,
                isAvailable: isAvailable,
                category: category,
                stock: parseInt(stock) || 0,
                brand: brand,
                model: model
            }, {
                headers: {
                    Authorization: `Bearer ${Token}`
                }
            });

            toast.success("Product added successfully", { id: loadingToast });
            navigate("/admin/products");

        } catch (error) {
            console.error("Error adding product:", error);
            const errorMessage = error.response?.data?.message || "Failed to add product";
            toast.error(errorMessage, { id: loadingToast });
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="w-full h-full flex overflow-y-scroll items-start p-[50px] justify-center">
            <Toaster /> {}
            <div className="w-[800px] bg-accent/90 p-[40px] rounded-2xl">
                <h1 className="text-xl text-primary mb-4 font-bold">Add New Product</h1>
                
                <div className='w-full bg-primary p-[20px] flex flex-row flex-wrap rounded-xl justify-between '>
                    
                    <div className='my-[10px] w-[40%]'>
                        <label>Product ID <span className="text-red-500">*</span></label>
                        <input type="text" value={productID} onChange={(e) => setProductID(e.target.value)} className='w-full p-[10px] h-[40px] border border-accent shadow-2xl rounded-xl focus:outline-none focus:ring-accent px-[20px] ' required />
                        <p className='w-full text-gray-500 text-right text-sm italic '>Provide a unique product Id </p>
                    </div>

                    <div className='my-[10px] w-[40%]'>
                        <label>Name <span className="text-red-500">*</span></label>
                        <input type="text" value={productName} onChange={(e) => setProductName(e.target.value)} className='w-full p-[10px] h-[40px] border border-accent shadow-2xl rounded-xl focus:outline-none focus:ring-accent px-[20px] ' required />
                    </div>

                    <div className='my-[10px] w-full'>
                        <label>Alternative Names</label>
                        <input type="text" value={altNames} onChange={(e) => setAltNames(e.target.value)} className='w-full p-[10px] h-[40px] border border-accent shadow-2xl rounded-xl focus:outline-none focus:ring-accent px-[20px] ' />
                        <p className='w-full text-gray-500 text-right text-sm italic '>Separate multiple names with commas </p>
                    </div>

                    <div className='my-[10px] w-full'>
                        <label>Description</label>
                        <textarea value={description} onChange={(e) => setDescription(e.target.value)} className='w-full p-[10px] h-[100px] border border-accent shadow-2xl rounded-xl focus:outline-none focus:ring-accent px-[20px] ' />
                    </div>

                    <div className='my-[10px] w-[40%]'>
                        <label>Price <span className="text-red-500">*</span></label>
                        <input type="number" min="0" value={price} onChange={(e) => setPrice(e.target.value)} className='w-full p-[10px] h-[40px] border border-accent shadow-2xl rounded-xl focus:outline-none focus:ring-accent px-[20px] ' required />
                    </div>

                    <div className='my-[10px] w-[40%]'>
                        <label>Labled Price <span className="text-red-500">*</span></label>
                        <input type="number" min="0" value={labledPrice} onChange={(e) => setLabledPrice(e.target.value)} className='w-full p-[10px] h-[40px] border border-accent shadow-2xl rounded-xl focus:outline-none focus:ring-accent px-[20px] ' required />
                    </div>

                    <div className='my-[10px] w-full'>
                        <label>Images <span className="text-red-500">*</span></label>
                        <input type="file" multiple={true} onChange={(e) => setFiles(e.target.files)} className='w-full p-[10px] h-[40px] border border-accent shadow-2xl rounded-xl focus:outline-none focus:ring-accent px-[20px] ' required />
                    </div>

                    <div className='my-[10px] flex flex-col w-[30%]'>
                        <label>Category <span className="text-red-500">*</span></label>
                        <select value={category} onChange={(e) => setCategory(e.target.value)} className='w-full p-[10px] h-[40px] border border-accent shadow-2xl rounded-xl focus:outline-none focus:ring-accent px-[20px] ' required>
                            <option value="laptops">Laptops</option>
                            <option value="gaming-laptops">Gaming Laptops</option>
                            <option value="monitors">Monitors</option>
                            <option value="keyboards">Keyboards</option>
                            <option value="mice">Mice</option>
                            <option value="ssds">SSDs</option>
                            <option value="ram">RAM</option>
                            <option value="graphic-cards">Graphics Cards</option>
                            <option value="processors">Processors (CPU)</option>
                            <option value="Others">Others</option>
                        </select>
                    </div>

                    <div className='my-[10px] w-[30%]'>
                        <label>Brand</label>
                        <input type="text" value={brand} onChange={(e) => setBrand(e.target.value)} className='w-full p-[10px] h-[40px] border border-accent shadow-2xl rounded-xl focus:outline-none focus:ring-accent px-[20px] ' />
                    </div>

                    <div className='my-[10px] w-[30%]'>
                        <label>Model <span className="text-red-500">*</span></label>
                        <input type="text" value={model} onChange={(e) => setModel(e.target.value)} className='w-full p-[10px] h-[40px] border border-accent shadow-2xl rounded-xl focus:outline-none focus:ring-accent px-[20px] ' required />
                    </div>

                    <div className='my-[10px] w-[40%]'>
                        <label>Stock Quantity <span className="text-red-500">*</span></label>
                        <input type="number" min="0" value={stock} onChange={(e) => setStock(e.target.value)} className='w-full p-[10px] h-[40px] border border-accent shadow-2xl rounded-xl focus:outline-none focus:ring-accent px-[20px] ' required />
                    </div>

                    <div className='my-[10px] flex flex-col w-[40%]'>
                        <label>Available <span className="text-red-500">*</span></label>
                        <select value={isAvailable} onChange={(e) => setIsAvailable(e.target.value === "true")} className='w-full p-[10px] h-[40px] border border-accent shadow-2xl rounded-xl focus:outline-none focus:ring-accent px-[20px] ' required>
                            <option value="true">YES</option>
                            <option value="false">NO</option>
                        </select>
                    </div>

                    <Link to="/admin/products" className='w-[49%] h-[50px] hover:bg-red-600 bg-red-500 text-primary rounded-xl mt-4 transition-colors font-bold flex items-center justify-center '>
                        Cancel
                    </Link>

                    <button 
                        onClick={addProduct} 
                        disabled={loading}
                        className={`w-[49%] h-[50px] font-bold rounded-xl mt-4 transition-colors border text-primary ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-accent/90 hover:bg-accent'}`}
                    >
                        {loading ? "Adding Product..." : "Add Product"}
                    </button>
                </div>
            </div>
        </div>
    );
}