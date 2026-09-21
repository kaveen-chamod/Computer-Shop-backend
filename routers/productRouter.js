import express from 'express';
import { createProduct, deleteProduct, getAllproducts, updateProduct , getProductById ,getProducts, searchProducts} from '../controllers/productController.js';

const productRouter = express.Router();

productRouter.post('/', createProduct);
productRouter.get('/', getAllproducts);
productRouter.delete('/:productid',deleteProduct)
productRouter.put("/:productid",updateProduct)
productRouter.get('/:productid', getProductById);
productRouter.get("/", getProducts);
productRouter.get("/search/:query", searchProducts);

export default productRouter;