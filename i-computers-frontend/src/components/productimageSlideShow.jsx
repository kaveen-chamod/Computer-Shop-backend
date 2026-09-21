import { useState } from "react";

export default function ImageSlider(props) {
    // පින්තූර නැත්නම් default පින්තූරයක් ලබා දීම
    const images = props.images && props.images.length > 0 ? props.images : ["/default.png"];
    
    const [activeIndex, setActiveIndex] = useState(0);

    return (
        <div className="w-full flex flex-col items-center">

            {/* MAIN IMAGE */}
            <div className="w-[90%] lg:w-[80%] max-h-[60vh] lg:h-[500px] flex justify-center items-center mb-6">
                <img 
                    src={images[activeIndex]}  
                    alt="Main Product"
                    className="w-full h-full object-contain drop-shadow-lg transition-all duration-300"
                />
            </div>

            {/* THUMBNAILS */}
            <div className="w-full min-h-[100px] justify-center items-center gap-3 lg:gap-4 flex flex-row flex-wrap">
                {
                    images.map((image, index) => {
                        return (
                            <img
                                key={index}
                                src={image}
                                alt={`Thumbnail ${index + 1}`}
                                className={`w-[70px] h-[70px] lg:w-[90px] lg:h-[90px] rounded-lg object-cover cursor-pointer transition-all duration-200 shadow-sm ${
                                    activeIndex === index
                                        ? "border-2 border-accent scale-105 opacity-100"
                                        : "opacity-50 hover:opacity-100 border border-gray-300"
                                }`}
                                onClick={() => { 
                                    setActiveIndex(index);
                                }}
                            />
                        )
                    })
                }
            </div>

        </div>
    );
}