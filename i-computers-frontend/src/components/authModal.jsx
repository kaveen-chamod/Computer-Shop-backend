export default function AuthModal({ isOpen, onClose }) {
    if (!isOpen) return null;

    return (
        <div className="fixed top-0 left-0 w-[100vw] h-screen bg-black/60 flex justify-center items-center z-[100]">
            <div className="bg-white p-8 rounded-xl shadow-2xl w-[400px] flex flex-col items-center">
                <h2 className="text-2xl font-bold mb-2 text-accent">Login Required</h2>
                <p className="mb-6 text-gray-500 text-center">You need to log in to perform this action.</p>
                
                <div className="flex gap-4 w-full">
                    <button 
                        onClick={() => {
                            window.location.href = "/signin"; 
                        }}
                        className="flex-1 px-4 py-2 bg-blue-200 text-gray-800 font-bold rounded-lg hover:bg-gray-300 transition"
                    >
                        Login
                    </button>
                    <button 
                        onClick={onClose} 
                        className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 font-bold rounded-lg hover:bg-gray-300 transition"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}