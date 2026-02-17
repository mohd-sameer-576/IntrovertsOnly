import React, { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, User, UserPlus, LogIn } from "lucide-react";
import Shell from "../components/Shell";

const SignupPage = () => {
  const [formData, setformData] = useState({
    fullname: '',
    email: '',
    password: '',
  });

  const navigate = useNavigate();
  const { signup, isSigningUp } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await signup(formData.fullname, formData.email, formData.password);
  };

  const handleChange = (e) => {
    setformData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Shell>
      <div className="w-full px-8 py-10 flex flex-col items-center">
        {/* Header Icon */}
        <div className="w-14 h-14 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(59,130,246,0.15)]">
          <UserPlus className="w-6 h-6 text-blue-400" />
        </div>

        {/* Text Header */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-black text-white tracking-tight mb-3">
            Create Account
          </h2>
          <p className="text-slate-400 text-sm font-medium">
            Join the community and start chatting
          </p>
        </div>

        <form onSubmit={handleSubmit} className="w-full space-y-5">
          {/* Full Name Field */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
              Full Name
            </label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
              <input
                type="text"
                name="fullname"
                value={formData.fullname}
                onChange={handleChange}
                placeholder="John Doe"
                required
                className="w-full pl-12 pr-4 py-4 bg-[#1e293b]/40 border border-slate-700/50 rounded-2xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all"
              />
            </div>
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
              Email Address
            </label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                required
                className="w-full pl-12 pr-4 py-4 bg-[#1e293b]/40 border border-slate-700/50 rounded-2xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
              Password
            </label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full pl-12 pr-4 py-4 bg-[#1e293b]/40 border border-slate-700/50 rounded-2xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSigningUp}
            className="w-full group relative flex items-center justify-center gap-3 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl shadow-[0_10px_20px_-10px_rgba(59,130,246,0.5)] transition-all active:scale-[0.98] disabled:opacity-50 mt-4"
          >
            {isSigningUp ? (
              <span className="loading loading-spinner loading-md"></span>
            ) : (
              <>
                <span className="text-lg">Sign Up</span>
                <UserPlus className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <div className="mt-10 text-center">
          <p className="text-slate-500 text-sm font-medium">
            Already have an account?{" "}
            <button
              onClick={() => navigate('/login')}
              className="text-blue-400 font-bold hover:text-blue-300 transition-colors inline-flex items-center gap-1"
            >
              Login
              <LogIn className="w-4 h-4" />
            </button>
          </p>
        </div>
      </div>
    </Shell>
  );
};

export default SignupPage;