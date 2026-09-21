import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FiMail, FiPhone, FiMapPin, FiSend } from "react-icons/fi";

export default function ContactUs() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // අවශ්‍ය නම් මෙයට අදාළ Backend Endpoint එකක් සකස් කර සම්බන්ධ කළ හැක.
            // උදාහරණයක් ලෙස: await axios.post(import.meta.env.VITE_BACKEND_URL + "/api/contact", formData);
            
            toast.success("Your message has been sent successfully!");
            setFormData({ name: "", email: "", subject: "", message: "" });
        } catch (error) {
            toast.error("Failed to send message. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full min-h-[calc(100vh-100px)] py-12 px-6 lg:px-16 bg-gray-50 flex justify-center items-center">
            <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-12">
                
                {/* Left Side: Contact Information */}
                <div className="flex flex-col justify-between">
                    <div>
                        <span className="bg-blue-50 text-primary text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                            Get in Touch
                        </span>
                        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 mt-4 mb-4">
                            We'd Love to Hear From You
                        </h1>
                        <p className="text-gray-500 text-base mb-8 leading-relaxed">
                            Have questions about our products, warranty, or computer parts? Reach out to us and our support team will get back to you as soon as possible.
                        </p>

                        <div className="flex flex-col gap-6">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-blue-50 text-primary rounded-xl text-xl mt-1">
                                    <FiMapPin />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800">Our Location</h3>
                                    <p className="text-sm text-gray-500">Isuri Computers, Main Street, Colombo, Sri Lanka</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-blue-50 text-primary rounded-xl text-xl mt-1">
                                    <FiPhone />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800">Phone Number</h3>
                                    <p className="text-sm text-gray-500">+94 11 234 5678 / +94 77 123 4567</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-blue-50 text-primary rounded-xl text-xl mt-1">
                                    <FiMail />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800">Email Address</h3>
                                    <p className="text-sm text-gray-500">support@isuricomputers.com</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-10 pt-6 border-t border-gray-100">
                        <p className="text-xs text-gray-400 font-medium">
                            © {new Date().getFullYear()} Isuri Computers. All rights reserved.
                        </p>
                    </div>
                </div>

                {/* Right Side: Contact Form */}
                <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100">
                    <h2 className="text-2xl font-bold text-slate-800 mb-6">Send Us a Message</h2>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-slate-600">Your Name</label>
                            <input 
                                type="text" 
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter your name"
                                required
                                className="w-full h-12 px-4 rounded-xl bg-white border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-slate-600">Email Address</label>
                            <input 
                                type="email" 
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                                required
                                className="w-full h-12 px-4 rounded-xl bg-white border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-slate-600">Subject</label>
                            <input 
                                type="text" 
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                placeholder="What is this regarding?"
                                required
                                className="w-full h-12 px-4 rounded-xl bg-white border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-slate-600">Message</label>
                            <textarea 
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                placeholder="Type your message here..."
                                rows="4"
                                required
                                className="w-full p-4 rounded-xl bg-white border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm resize-none"
                            ></textarea>
                        </div>

                        <button 
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary text-white font-bold py-3 rounded-xl hover:opacity-90 transition-opacity shadow-md disabled:bg-gray-400 flex items-center justify-center gap-2 mt-2"
                        >
                            {loading ? "Sending..." : <><span>Send Message</span> <FiSend /></>}
                        </button>
                    </form>
                </div>

            </div>
        </div>
    );
}