import React, { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";

const EditProfileModal = ({ isOpen, onClose, onSubmit }) => {
  const { authUser, updateUser } = useAuthStore();
  const [editForm, setEditForm] = useState({
    fullname: authUser?.fullname || "",
    email: authUser?.email || "",
    password: "",
    profilePic: null,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let profilePic = authUser?.profilePic;

      if (editForm.profilePic) {
        profilePic = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(editForm.profilePic);
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
        });
      }

      const response = await fetch(
        "http://localhost:3000/api/auth/update-profile",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            fullname: editForm.fullname,
            email: editForm.email,
            password: editForm.password,
            profilePic,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update profile");
      }

      updateUser(data.user);
      onClose();
      setEditForm({
        fullname: data.user.fullname,
        email: data.user.email,
        password: "",
        profilePic: null,
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      alert(error.message || "An error occurred while updating the profile");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 w-[90%] max-w-md">
        <h2 className="text-xl font-semibold mb-4 text-center">
          Edit Profile
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            value={editForm.fullname}
            onChange={(e) =>
              setEditForm({ ...editForm, fullname: e.target.value })
            }
            className="w-full px-4 py-3 rounded-xl bg-white/10 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={editForm.email}
            onChange={(e) =>
              setEditForm({ ...editForm, email: e.target.value })
            }
            className="w-full px-4 py-3 rounded-xl bg-white/10 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="password"
            placeholder="New Password (optional)"
            value={editForm.password}
            onChange={(e) =>
              setEditForm({ ...editForm, password: e.target.value })
            }
            className="w-full px-4 py-3 rounded-xl bg-white/10 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setEditForm({ ...editForm, profilePic: e.target.files[0] })
            }
            className="w-full px-4 py-3 rounded-xl bg-white/10 text-white outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 rounded-xl bg-gray-500 hover:bg-gray-600 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 transition disabled:opacity-50"
            >
              {loading ? "Updating..." : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
