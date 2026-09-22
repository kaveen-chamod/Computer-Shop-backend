import axios from "axios";
import toast from "react-hot-toast";
import { useState } from "react";

export default function ProductDeleteButton(props) {
  const productId = props.productId;
  const reload = props.reload;

  const [isMessageOpen, setIsMessageOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    setIsDeleting(true);

    const token = localStorage.getItem("token");

    axios
      .delete(
       
        import.meta.env.VITE_BACKEND_URL + "/api/products/" + productId,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(() => {
        toast.success("Product deleted successfully");
        setIsDeleting(false);
        setIsMessageOpen(false);
        reload(); 
      })
      .catch((error) => {
        console.error("Delete error:", error);
        toast.error(error.response?.data?.message || "Failed to delete product");
        setIsDeleting(false);
      });
  }

  return (
    <>
      <button
        onClick={() => {
          setIsMessageOpen(true);
        }}
        className="px-4 py-2 text-sm rounded-lg bg-red-100 text-red-600 cursor-pointer hover:bg-red-200 transition font-medium"
      >
        Delete
      </button>

      
      {isMessageOpen && (
        <div className="w-[100vw] h-screen fixed top-0 left-0 bg-black/60 flex justify-center items-center z-50">
          
          <div className="w-[600px] h-[300px] bg-white rounded-2xl relative flex flex-col justify-center items-center shadow-2xl">
            
            <button
              onClick={() => {
                setIsMessageOpen(false);
              }}
              className="w-[40px] h-[40px] bg-red-600 text-white rounded-full text-xl font-bold cursor-pointer hover:bg-red-800 absolute right-[-15px] top-[-15px] shadow-lg"
            >
              X
            </button>

            <h1 className="text-xl mb-8 text-center font-bold text-gray-800 px-10">
              Are you sure you want to delete this product? <br/>
              <span className="text-red-500 mt-2 block">{productId}</span>
            </h1>

            <div className="flex justify-center gap-6 w-full px-10">
              
              <button
                disabled={isDeleting}
                onClick={handleDelete}
                className={`px-6 py-2 text-lg rounded-lg font-bold text-white transition ${
                  isDeleting 
                    ? "bg-red-400 cursor-not-allowed" 
                    : "bg-red-500 hover:bg-red-600 cursor-pointer shadow-md"
                }`}
              >
                {isDeleting ? "Deleting..." : "Yes, Delete"}
              </button>

              <button
                onClick={() => {
                  setIsMessageOpen(false);
                }}
                disabled={isDeleting}
                className="px-6 py-2 text-lg rounded-lg bg-gray-200 text-gray-800 cursor-pointer hover:bg-gray-300 transition font-bold shadow-md"
              >
                Cancel
              </button>

            </div>
          </div>
        </div>
      )}
    </>
  );
}