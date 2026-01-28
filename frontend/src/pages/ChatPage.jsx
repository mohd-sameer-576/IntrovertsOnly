import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import UsersSidebar from "../components/UsersSidebar";
import ChatArea from "../components/ChatArea";
import ProfilePanel from "../components/ProfilePanel";
import EditProfileModal from "../components/EditProfileModal";

const ChatPage = () => {
  const { authUser, logout } = useAuthStore();
  const { getUsers, initializeSocket, disconnectSocket } = useChatStore();

  const [showUsers, setShowUsers] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);

  useEffect(() => {
    getUsers();
    // Initialize Socket.IO
    if (authUser?._id) {
      initializeSocket(authUser._id);
    }

    return () => {
      disconnectSocket();
    };
  }, [authUser?._id, getUsers, initializeSocket, disconnectSocket]);

  const handleDeleteAccount = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:3000/api/auth/delete-account",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete account");
      }

      alert("Account deleted successfully");
      logout();
    } catch (error) {
      console.error("Error deleting account:", error);
      alert(error.message || "An error occurred while deleting the account");
    }
  };

  return (
    <div
      className="h-[92vh] w-[95vw] mx-auto mt-4 rounded-[2.5rem]
bg-linear-to-br from-[#0b1220] via-[#0e1629] to-[#0b1220]
border border-fuchsia-500/40 shadow-[0_0_60px_-15px_rgba(217,70,239,0.6)]
flex overflow-hidden text-white relative"
    >
      {/* MOBILE TOP BAR */}
      <div className="absolute top-4 left-4 right-4 flex justify-between md:hidden z-50">
        <button
          onClick={() => setShowUsers(true)}
          className="px-4 py-2 rounded-xl bg-white/10 backdrop-blur"
        >
          ☰ Chats
        </button>
        <button
          onClick={() => setShowProfile(true)}
          className="px-4 py-2 rounded-xl bg-white/10 backdrop-blur"
        >
          ⚙ Profile
        </button>
      </div>

      <UsersSidebar showUsers={showUsers} onClose={() => setShowUsers(false)} />
      <ChatArea />
      <ProfilePanel
        showProfile={showProfile}
        onClose={() => setShowProfile(false)}
        onEdit={() => setShowEditForm(true)}
        onDelete={handleDeleteAccount}
      />
      <EditProfileModal
        isOpen={showEditForm}
        onClose={() => setShowEditForm(false)}
      />
    </div>
  );
};

export default ChatPage;
