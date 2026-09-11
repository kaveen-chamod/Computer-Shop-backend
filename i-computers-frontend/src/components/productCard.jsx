export default function ProductCard(props) {
    console.log(props);
    return (
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300 p-5 flex flex-col items-center w-72 m-4">
            <h1 className="text-xl font-semibold text-gray-800 self-start mb-4">
                {props.name}
            </h1>
            
            <div className="w-full aspect-video bg-gray-50 rounded-xl overflow-hidden mb-5 flex justify-center items-center">
                <img 
                    src={props.photo} 
                    alt={props.name}
                    className="w-full h-full object-cover" 
                />
            </div>
            
            <p className="text-2xl font-bold text-gray-900 self-start">
                {props.price}
            </p>
        </div>
    );
}