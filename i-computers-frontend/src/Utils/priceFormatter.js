export default function getFormattedPrice(price) {
    // price එකක් දීලා නැත්නම් N/A කියලා යවනවා
    if (price == null) {
        return "N/A";
    }

    const priceInNumber = Number(price);

    if (isNaN(priceInNumber)) {
        return "N/A";
    } else {
        
        return "LKR " + priceInNumber.toLocaleString("en-US", { 
            minimumFractionDigits: 2, 
            maximumFractionDigits: 2 
        });
    }
}