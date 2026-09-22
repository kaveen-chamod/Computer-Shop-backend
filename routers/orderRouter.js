import express from "express";

import { createOrder, getOrders, updateOrderStatus , getMyOrders} from "../controllers/orderController.js";

const orderRouter = express.Router();

orderRouter.post("/", createOrder);
orderRouter.get("/", getOrders);
orderRouter.put("/:orderId", updateOrderStatus);


orderRouter.get("/my-orders", getMyOrders);

export default orderRouter;