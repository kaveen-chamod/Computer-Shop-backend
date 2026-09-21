import { Link } from "react-router-dom";

import getFormattedPrice from "../utils/priceFormatter"; 

export default function ProductCard(props) {
  const product = props.product;

  
  const id = product.productid || product.productId || product._id;
  
  
  const labledPrice = product.labelledprice || product.labledPrice || 0;

  return (
    
    <Link to={"/overview/" + id} className="w-[300px] h-[400px] shadow-2xl m-4 cursor-pointer relative group block overflow-hidden rounded-lg">
      
      <div className="w-full h-[250px] relative bg-gray-100">
        
        <img 
          src={product.images && product.images.length > 1 ? product.images[1] : (product.images?.[0] || "/default.png")} 
          alt={product.name}
          className="w-full h-full absolute bg-white object-cover" 
        /> 
        
        
        <img 
          src={product.images && product.images.length > 0 ? product.images[0] : "/default.png"} 
          alt={product.name}
          className="w-full h-full absolute bg-white transition-opacity duration-500 object-cover group-hover:opacity-0 primary-image" 
        /> 
      </div>

      <div className="w-full h-[150px] p-2 flex flex-col justify-between bg-white z-20 relative">
        <h1 className="text-accent/90 font-bold text-center text-xl line-clamp-2">{product.name}</h1>
        
        <div className="w-full flex flex-col items-center pb-2">
          
          {
            labledPrice > product.price && (
              <h2 className="text-secondary/80 line-through decoration-amber-600 decoration-2 mr-2 text-sm">
                {/* 2. getFormattedPrice භාවිතය */}
                {getFormattedPrice(labledPrice)}
              </h2>
            )
          }
          <h2 className="text-accent font-bold text-2xl">
            {/* 3. getFormattedPrice භාවිතය */}
            {getFormattedPrice(product.price)}
          </h2>
        </div>
      </div>

      {/* 4. Bottom Overlay Div - Uses group-hover:opacity-100 to show up when the card is hovered */}
      <div className="w-full h-[150px] bg-white/95 bottom-0 absolute flex flex-row justify-center items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30">
        <button 
          // Link එක ඇතුලේ තියෙන නිසා මෙතන to="" අවශ්‍ය නැත
          className="px-4 py-2 cursor-pointer bg-accent text-white font-bold rounded-md hover:bg-accent/80 transition-colors duration-200 h-[50px] w-[150px] text-center flex justify-center items-center shadow-lg"
        >
          View Details
        </button>
      </div>
      
    </Link>
  );
}