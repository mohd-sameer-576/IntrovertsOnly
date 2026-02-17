import React, { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, LogIn, UserPlus } from "lucide-react";
import Shell from "../components/Shell";

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const { login, isLoggingIn } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(formData.email, formData.password);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Shell>
      {/* Form container is now transparent to show the Shell background */}
      <div className="w-full max-w-md p-10 md:p-14">
        {/* Header Section */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-500/10 rounded-full mb-4 border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
            <LogIn className="w-6 h-6 text-blue-400" />
          </div>
          <h2 className="text-4xl font-black text-white tracking-tight mb-2">
            Welcome Back
          </h2>
          <p className="text-slate-400 text-sm">Enter your credentials to access your chats</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Input */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="sameer@test.com"
                className="w-full pl-11 pr-4 py-3.5 bg-slate-800/40 border border-slate-700/50 rounded-xl text-white placeholder-slate-600 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition-all"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <div className="flex justify-between items-center ml-1">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Password</label>
              <button type="button" className="text-xs text-blue-400/80 hover:text-blue-400 transition">Forgot?</button>
            </div>
            <div className="relative group">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••"
                className="w-full pl-11 pr-4 py-3.5 bg-slate-800/40 border border-slate-700/50 rounded-xl text-white placeholder-slate-600 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition-all"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoggingIn}
            className="w-full flex items-center justify-center gap-3 py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-bold rounded-xl shadow-lg shadow-blue-600/20 transition-all active:scale-[0.97]"
          >
            {isLoggingIn ? (
              <span className="loading loading-spinner loading-md"></span>
            ) : (
              <>
                <span className="text-lg">Sign In</span>
                <LogIn className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-10 text-center">
          <p className="text-slate-400 text-sm">
            New to the platform?{" "}
            <button
              onClick={() => navigate("/signup")}
              className="text-blue-400 font-bold hover:text-blue-300 transition-colors"
            >
              Create account
            </button>
          </p>
        </div>
      </div>
    </Shell>
  );
};

export default LoginPage;