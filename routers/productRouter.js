import express from 'express';
import { createProduct, deleteProduct, getAllproducts, updateProduct } from '../controllers/productController.js';

const productRouter = express.Router();

productRouter.post('/', createProduct);
productRouter.get('/', getAllproducts);
productRouter.delete('/:productid',deleteProduct)
productRouter.put("/:productid",updateProduct)

export default productRouter;