"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai"; // Eye icons

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    const handleSubmit = (e) => {
        e.preventDefault();
        // TODO: Authenticate here
        router.push("/dashboard");
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-[#f5f7fa]">
            <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8 space-y-6">
                <h2 className="text-3xl font-bold text-center text-blue-600">
                    Welcome Back
                </h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label htmlFor="email" className="block text-sm text-gray-600 mb-2 font-medium">
                            Email Address
                        </label>
                        <input
                            id="email"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none focus:border-transparent transition-all duration-300"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm text-gray-600 mb-2 font-medium">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg shadow-sm pr-10 focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none transition-all duration-300"
                            />
                            <span
                                onClick={togglePasswordVisibility}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                            >
                                {showPassword ? (
                                    <AiOutlineEyeInvisible className="text-gray-500 text-xl" />
                                ) : (
                                    <AiOutlineEye className="text-gray-500 text-xl" />
                                )}
                            </span>
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-200 "
                    >
                        Login
                    </button>
                </form>
                <p className="text-sm text-center text-gray-500">
                    <a href="#" className="text-blue-500 hover:underline">Forgot Password?</a>
                </p>
            </div>
        </div>
    );
}
