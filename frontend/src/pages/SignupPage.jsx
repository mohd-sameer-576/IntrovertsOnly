import React from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Shell from "../components/Shell";
import Loader from '../components/Loader'
const SignupPage = () => {
  const [formData, setformData] = useState({
    fullname: '',
    email: '',
    password: '',
  })
  const navigate = useNavigate();
  const {signup,isSigningUp}=useAuthStore()
  const handleSubmit = async (e) => {
    e.preventDefault();
    await signup(formData.fullname, formData.email, formData.password);
  }
  const handleChange = (e) => {
    setformData({ ...formData, [e.target.name]: e.target.value });
  }
  return (
    <Shell>
      <div className="min-h-[70vh] rounded-3xl p-10 min-w-[50vw] bg-linear-to-br from-[#141e30] via-[#243b55] to-[#141e30] flex items-center justify-center">
        <div className="w-full max-w-md bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/20">
          <h2 className="text-3xl font-bold text-white text-center mb-2">
            Create Account
          </h2>
          <p className="text-gray-300 text-center mb-6">
            Sign up to start chatting
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm text-gray-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="fullname"
                value={formData.fullname}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-gray-300 border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-gray-300 border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-gray-300 border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <button
              type="submit"
              disabled={isSigningUp}
              className="w-full py-2.5 rounded-lg bg-blue-500 hover:bg-blue-600 transition text-white font-semibold shadow-lg disabled:opacity-50"
            >
              {isSigningUp ? <span className="loading loading-dots loading-xl"></span>  : "Sign Up"}
            </button>
          </form>

          <p className="text-center text-gray-300 text-sm mt-6">
            Already have an account?
            <span onClick={() => navigate('/login')} className="text-blue-400 hover:underline cursor-pointer ml-1">
              Login
            </span>
          </p>
        </div>
      </div>
    </Shell>
  );
};

export default SignupPage;
