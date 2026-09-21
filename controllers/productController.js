import { json } from "express";
import Product from "../Models/product.js";

export async function createProduct(req, res) {
    if (req.user == null) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }

    if (!req.user.isAdmin) {
        res.status(401).json({ message: "Only admin can create products" });
        return;
    }

    try {
        const existingProducts = await Product.findOne({ productid: req.body?.productid });

        if (existingProducts != null) {
            res.status(400).json({ message: "Product with this productid already exists" });
            return;
        }

        const product = new Product(req.body);
        await product.save();
        res.status(201).json({ message: "Product created successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

export async function getAllproducts(req,res) {
    try {
        if(req.user !=null && req.user.isAdmin){
            const products = await Product.find()
            return res.json(products)
        }else{
        const products = await Product.find({isAvailable:true});
        return res.json(products);
        }
        
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}


export async function deleteProduct(req,res) {
    if(req.user !=null && req.user.isAdmin){
        try{
            const product = await Product.findOne({productid:req.params.productid})
            if(product == null){
                res.status(404).json({message : "product not found"
                })
                return
            }
            await product.deleteOne({
                productid : req.params.productid
            }
            )
            res.json({
                message : "product delete successfuly"
            })
        }catch(err){
                res.status(500).json({message : err.message})
        }
        }else{
            res.status(403).json({message: " only admin can delete products"})
        }
        
    }
    


export async function updateProduct(req,res) {
    if(req.user !=null && req.user.isAdmin){
        try{
            if (req.body.productid !=null){
                res.status(400).json({message : "productid cannot be updated"})
                return
            }
            await Product.updateOne({productid : req.params.productid},req.body)  
            res.json({
                message : "product update successfully"
            })
              }catch(err){
                res.jsons(500).json({
                    message: err.message}
                )
              }
    }
    
}


// Product එකක් ID එකෙන් ලබාගැනීමේ Function එක
export async function getProductById(req, res) {
    try {
        const productId = req.params.productid;
        
        // ⚠️ ඔබගේ Database එකේ ID column එකේ නම productid ද නැතිනම් productId ද යන්න අනුව මෙය වෙනස් විය හැක.
        // ගැටළුවක් මඟහරවා ගැනීමට $or භාවිතා කර ඇත.
        const product = await Product.findOne({ 
            $or: [
                { productId: productId },
                { productid: productId }
            ]
        });

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.json(product);
    } catch (error) {
        res.status(500).json({ message: "Error fetching product", error: error.message });
    }
}



// නිෂ්පාදන සෙවීම සඳහා (Search Controller)
export async function searchProducts(req, res) {
    try {
        const query = req.params.query;
        // නම හෝ වෙනත් ෆීල්ඩ් එකක් අනුව MongoDB එකෙන් සෙවීම (Regex භාවිතයෙන් අකුරු කොටසක් ගැළපුණත් පෙන්වයි)
        const products = await Product.find({
            name: { $regex: query, $options: "i" } 
        });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: "Error searching products", error: error.message });
    }
}

export async function getProducts(req, res) {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: "Error fetching products", error: error.message });
    }
}
