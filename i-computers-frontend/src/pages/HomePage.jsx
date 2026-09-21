import { Routes, Route } from "react-router-dom";

// Components
import Header from "../components/header";
import Footer from "../components/footer";


// Pages
import Home from "./homeContent";
import ProductPage from "./productPage";
import ProductOverview from "./productOverview";
import CartPage from "./cartPage";
import CheckOutPage from "./checkOutPage";
import Settings from "./setting";
//import OrdersPage from "./ordersPage";
//import AboutPage from "./aboutPage";
import ContactUs from "./ContactUs";
import MyOrders from "./myOrders";

export default function HomePage(props) {
    return (
        <div className="w-full h-full overflow-y-auto">
            <Header />
            
            <div className="w-full min-h-[calc(100vh-100px)]">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/products" element={<ProductPage />} />
                    <Route path="/overview/:productId" element={<ProductOverview />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/checkout" element={<CheckOutPage />} />
                    <Route path="/setting" element = {<Settings />} />
                    {/* <Route path="/orders" element={<OrdersPage />} />
                    <Route path="/about" element={<AboutPage />} />*/}
                    <Route path="/contact" element={<ContactUs />} /> 
                    <Route path="/my-orders" element={<MyOrders />} />
                    
                    {/* 404 Page Not Found */}
                    <Route path="/*" element={
                        <div className="flex flex-col items-center justify-center w-full h-[50vh]">
                            <h1 className="text-4xl font-bold text-gray-400 mb-2">404</h1>
                            <h2 className="text-2xl text-gray-500">Page Not Found</h2>
                        </div>
                    } />
                </Routes>
            </div>
            
            <Footer />
        </div>
    );
}