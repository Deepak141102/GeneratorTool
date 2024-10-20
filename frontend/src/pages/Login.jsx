import React from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();
    
    const handleLogin = () => {
        // Ensure this URL is correctly set in your .env file
        window.location.href = `${import.meta.env.VITE_BACKEND_BASE_URL}/auth/google`;
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center bg-black overflow-hidden">
            {/* Futuristic Animated Background */}
            <div className="absolute inset-0 z-0">
                {/* Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-800 to-yellow-500 opacity-90 animate-background" />
                {/* Angular Polygon Pattern */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1440 320">
                    <polygon fill="rgba(255, 255, 255, 0.05)" points="0,320 1440,320 1440,0 0,0" />
                    <polygon fill="rgba(255, 255, 255, 0.1)" points="200,320 1240,160 1440,0 0,160" />
                </svg>
                {/* Animated Waves */}
                <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-blue-600 to-transparent opacity-70 animate-wave" />
            </div>

            {/* Login Form */}
            <div className="relative z-10 p-10 bg-gray-800 rounded-3xl shadow-2xl border border-blue-500 backdrop-blur-md max-w-md w-full">
                <h1 className="text-4xl font-bold text-white mb-4 text-center">Receipts Fast, Impact Faster!</h1>
                <p className="text-gray-300 mb-6 text-center">Log in to explore endless possibilities.</p>
                <button
                    onClick={handleLogin}
                    className="w-full py-3 bg-gradient-to-r from-blue-500 to-yellow-400 text-white font-semibold rounded-lg shadow-lg transition-transform transform hover:scale-105"
                >
                    Sign in with Google
                </button>
                <p className="mt-4 text-center text-gray-400">
                    Found the tool you need? <a href="https://www.barabaricollective.org/services.html" className="text-yellow-400 hover:underline">Click here</a>
                </p>
            </div>

            {/* Custom Animations */}
            <style jsx>{`
                @keyframes background {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                @keyframes wave {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-background {
                    background: linear-gradient(270deg, #1e3c72, #f9d423);
                    background-size: 400% 400%;
                    animation: background 20s ease infinite;
                }
                .animate-wave {
                    animation: wave 10s linear infinite;
                }
            `}</style>
        </div>
    );
};

export default Login;
