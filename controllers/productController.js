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

