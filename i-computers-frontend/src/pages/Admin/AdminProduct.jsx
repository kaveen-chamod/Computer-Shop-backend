import { FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";
export default function AdminProduct(){
return(
    <div>
    <h2>AdminProduct</h2>

    <Link to = "/admin/add-product"
                className="bg-accent w-20 h-20 rounded-full text-red-500 text-2xl flex justify-center items-center fixed bottom-4 right-4 shadow-2xl hover:bg-red-500 hover:text-accent">
        <FaPlus />
    </Link>
    </div>
 )
}
