import toast from "react-hot-toast";

export function getCart() {
    const cartString = localStorage.getItem("cart");
    if (cartString == null) {
        localStorage.setItem("cart", "[]");
        return [];
    } else {
        return JSON.parse(cartString);
    }
}

export function addToCart(product, quantity) {
    const cart = getCart();
    
    
    const id = product.productid || product.productId || product._id;

    
    const index = cart.findIndex((item) => {
        return item.productId === id;
    });

    if (index === -1) {
        
        cart.push({
            productId: id,
            name: product.name,
            price: product.price,
            labelledprice: product.labelledprice || product.labledPrice || 0,
            quantity: quantity,
            image: product.images && product.images.length > 0 ? product.images[0] : "/default.png"
        });
        toast.success(`${product.name} added to cart`);
    } else {
        
        const newQty = cart[index].quantity + quantity;
        
        if (newQty <= 0) {
            cart.splice(index, 1);
            toast.success(`${product.name} removed from cart`);
        } else {
            cart[index].quantity = newQty;
            toast.success(`Updated ${product.name} quantity to ${newQty}`);
        }
    }
    
    
    const cartString = JSON.stringify(cart);
    localStorage.setItem("cart", cartString);
}

export function emptyCart() {
    localStorage.setItem("cart", "[]");
}

export function getCartTotal() {
    let total = 0;
    const cart = getCart();
    
    cart.forEach((item) => {
        total += item.price * item.quantity;
    });
    
    return total;
}