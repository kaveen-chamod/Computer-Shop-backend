import React, { useState, useEffect } from "react";
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate, useLocation, Link } from "react-router-dom";
import axios from "axios";
import { MediaUpload } from "../../utils/MediaUpload";

export default function AdminEditProductForm(props) { 

    const navigate = useNavigate();
    const location = useLocation();
    
    // location.state හරහා එන product දත්ත ලබාගැනීම
    const product = location.state;

    // කෙලින්ම URL එකෙන් ආවොත් product එකක් නැති නිසා ආපහු හරවලා යවනවා
    useEffect(() => {
        if (!product) {
            navigate("/admin/product");
        }
    }, [product, navigate]);

    // Initial state අගයන් product එකේ දත්ත වලින් පුරවා ඇත
    const [productName, setProductName] = useState(product?.name || "");
    const [altNames, setAltNames] = useState(product?.altname?.join(", ") || "");
    const [description, setDescription] = useState(product?.description || "");
    const [price, setPrice] = useState(product?.price || "0");
    const [labledPrice, setLabledPrice] = useState(product?.labelledprice || "0");
    const [files, setFiles] = useState([]); // අලුත් පින්තූර තෝරනවා නම් පමණක්
    const [isAvailable, setIsAvailable] = useState(product?.isAvailable ?? true);
    const [category, setCategory] = useState(product?.category || "laptops");
    const [stock, setStock] = useState(product?.stock || 0);
    const [brand, setBrand] = useState(product?.brand || "");
    const [model, setModel] = useState(product?.model || "");
    const [loading, setLoading] = useState(false); 

    const productID = product?.productid || product?.productId; // ID එක වෙනස් කරන්න දෙන්නේ නෑ

    async function updateProduct() {
        if (!productName || !price || !category || !model) {
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
        const loadingToast = toast.loading("Updating product...");
        
        try {
            let uploadedImages = product.images; // මුලින්ම පරණ පින්තූර ටික තියාගන්නවා

            // අලුතෙන් පින්තූර තෝරලා තියෙනවා නම් ඒවා upload කරනවා
            if (files.length > 0) {
                const imagepromises = [];
                for (let i = 0; i < files.length; i++) {
                    const promise = MediaUpload(files[i]);
                    imagepromises.push(promise);
                }
                uploadedImages = await Promise.all(imagepromises);
            }
            
            const altNameInarray = altNames.split(",").map((name) => name.trim());

            // Backend එකට යවන දත්ත (productid එක යවන්නේ නෑ, ඒක route එකේ යවනවා)
            const updateData = {
                name: productName,
                altname: altNameInarray,
                description: description,
                price: Number(price),
                labelledprice: Number(labledPrice),
                images: uploadedImages, // අලුත් ඒවද පරණ ඒවද කියලා උඩදි තීරණය කළා
                isAvailable: isAvailable,
                category: category,
                stock: parseInt(stock) || 0,
                brand: brand,
                model: model
            };

            // අනිවාර්යයෙන්ම ඔබේ Backend route එක අනුව මෙහි PUT ද PATCH ද යන්න වෙනස් කරගන්න (බොහෝවිට PUT වේ)
            await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/products/${productID}`, updateData, {
                headers: {
                    Authorization: `Bearer ${Token}`
                }
            });

            toast.success("Product updated successfully", { id: loadingToast });
            navigate("/admin/product");

        } catch (error) {
            console.error("Error updating product:", error);
            const errorMessage = error.response?.data?.message || "Failed to update product";
            toast.error(errorMessage, { id: loadingToast });
        } finally {
            setLoading(false);
        }
    }

    if (!product) return null; // product නැත්නම් මුකුත් render කරන්නේ නෑ (useEffect එකෙන් redirect කරනකම්)

    return (
        <div className="w-full h-full flex overflow-y-scroll items-start p-[50px] justify-center">
            <Toaster />
            <div className="w-[800px] bg-accent/90 p-[40px] rounded-2xl border-1 shadow-2xl">
                <h1 className="text-2xl text-blue-300 mb-6 font-bold">Edit Product: <span className="text-white">{productID}</span></h1>
                
                <div className='w-full bg-primary p-[20px] flex flex-row flex-wrap rounded-xl justify-between shadow-inner'>
                    
                    <div className='my-[10px] w-[40%]'>
                        <label>Product ID <span className="text-red-500">*</span></label>
                        {/* ID එක වෙනස් කරන්න බැරි නිසා disabled කර ඇත */}
                        <input type="text" value={productID} disabled className='w-full p-[10px] h-[40px] border border-gray-400 bg-gray-200 shadow-2xl rounded-xl focus:outline-none px-[20px] cursor-not-allowed' />
                        <p className='w-full text-gray-500 text-right text-sm italic '>Product ID cannot be changed</p>
                    </div>

                    <div className='my-[10px] w-[40%]'>
                        <label>Name <span className="text-red-500">*</span></label>
                        <input type="text" value={productName} onChange={(e) => setProductName(e.target.value)} className='w-full p-[10px] h-[40px] border border-accent shadow-2xl rounded-xl focus:outline-none focus:ring-accent px-[20px] ' required />
                    </div>

                    <div className='my-[10px] w-full'>
                        <label>Alternative Names</label>
                        <input type="text" value={altNames} onChange={(e) => setAltNames(e.target.value)} className='w-full p-[10px] h-[40px] border border-accent shadow-2xl rounded-xl focus:outline-none focus:ring-accent px-[20px] ' />
                        <p className='w-full text-gray-500 text-right text-sm italic '>Separate multiple names with commas</p>
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
                        <label>Images (Leave empty to keep existing images)</label>
                        {/* පින්තූර අනිවාර්ය කර නෑ (required අයින් කරලා තියෙන්නේ), මොකද පරණ ඒවා තියෙන නිසා */}
                        <input type="file" multiple={true} onChange={(e) => setFiles(e.target.files)} className='w-full p-[10px] h-[40px] border border-accent shadow-2xl rounded-xl focus:outline-none focus:ring-accent px-[20px] ' />
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
                        <select value={brand} onChange={(e) => setBrand(e.target.value)} className='w-full p-[10px] h-[40px] border border-accent shadow-2xl rounded-xl focus:outline-none focus:ring-accent px-[20px] '>
                            <option value="">Select a brand</option>
                            <option value="Dell">Dell</option>
                            <option value="HP">HP</option>
                            <option value="Lenovo">Lenovo</option>
                            <option value="Apple">Apple</option>
                            <option value="Asus">Asus</option>
                            <option value="Acer">Acer</option>
                            <option value="MSI">MSI</option>
                            <option value="Razer">Razer</option>
                            <option value="Nvidia">Nvidia</option>
                            <option value="AMD">AMD</option>
                            <option value="Intel">Intel</option>
                            <option value="Other">Other</option>
                        </select>
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

                    <Link to="/admin/product" className='w-[49%] h-[50px] hover:bg-red-600 bg-red-500 text-primary rounded-xl mt-6 transition-colors font-bold flex items-center justify-center '>
                        Cancel
                    </Link>

                    <button 
                        disabled={loading}
                        onClick={updateProduct} 
                        className={`w-[49%] h-[50px] rounded-xl mt-6 transition-colors font-bold flex items-center justify-center ${
                            loading
                            ? 'bg-gray-400 text-primary cursor-not-allowed'
                            : 'bg-green-500 hover:bg-green-600 text-white cursor-pointer'
                        }`}
                    >
                        {loading ? "Updating..." : "Update Product"}
                    </button>
                </div>
            </div>
        </div>
    );
}