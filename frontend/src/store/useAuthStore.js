import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
  authUser: null,           // null initially
  isCheckingAuth: true,
  isSigningUp: false,

  checkAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data.user || null }); // always set null if no user
    } catch (err) {
      console.log("Auth check failed:", err);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (fullname, email, password) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", {
        fullname,
        email,
        password,
      });
      set({ authUser: res.data });
      toast.success("Signup successful!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Signup failed");
      set({ authUser: null });
    } finally {
      set({ isSigningUp: false });
    }
  },
  login: async (email, password) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/login", {
        email,
        password,
      });
      set({ authUser: res.data });
      toast.success("Login successful!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
      set({ authUser: null });
    } finally {
      set({ isSigningUp: false });
    }
  },
  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Logout failed");
    }
  },
  updateUser: (updatedUser) => {
    set({ authUser: updatedUser });
    toast.success("Profile updated successfully!");
  },
}));
