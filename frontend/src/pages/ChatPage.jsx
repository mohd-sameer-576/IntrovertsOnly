import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { Menu, User, Settings2, Trash2, LogOut } from "lucide-react"; // Added for modern icons
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
    if (authUser?._id) initializeSocket(authUser._id);
    return () => disconnectSocket();
  }, [authUser?._id, getUsers, initializeSocket, disconnectSocket]);

  const handleDeleteAccount = async () => {
    if (!window.confirm("Permanent action: Delete your account?")) return;
    try {
      const response = await fetch("http://localhost:3000/api/auth/delete-account", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to delete account");
      alert("Account deleted");
      logout();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-[#05070a] p-2 md:p-6 flex items-center justify-center font-sans">
      {/* MAIN CONTAINER */}
      <div className="relative h-[94vh] w-full max-w-[1600px] flex overflow-hidden
                      bg-[#0b0e14]/80 backdrop-blur-2xl
                      rounded-[2rem] border border-white/5 
                      shadow-[0_0_80px_-20px_rgba(0,0,0,0.8)]">
        
        {/* DECORATIVE AMBIENCE (Glows) */}
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-fuchsia-600/10 blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] pointer-events-none" />

        {/* MOBILE HEADER */}
        <div className="absolute top-0 left-0 right-0 h-16 flex items-center justify-between px-6 md:hidden z-40 bg-black/20 backdrop-blur-md border-b border-white/5">
          <button 
            onClick={() => setShowUsers(true)}
            className="p-2 hover:bg-white/5 rounded-full transition-colors"
          >
            <Menu className="w-6 h-6 text-fuchsia-400" />
          </button>
          <span className="font-bold tracking-tight bg-gradient-to-r from-fuchsia-400 to-blue-400 bg-clip-text text-transparent">
            MESSENGER
          </span>
          <button 
            onClick={() => setShowProfile(true)}
            className="p-2 hover:bg-white/5 rounded-full transition-colors"
          >
            <User className="w-6 h-6 text-blue-400" />
          </button>
        </div>

        {/* SIDEBARS & CONTENT */}
        <div className="flex w-full h-full pt-16 md:pt-0">
          <UsersSidebar 
            showUsers={showUsers} 
            onClose={() => setShowUsers(false)} 
            className="border-r border-white/5 bg-black/10"
          />
          
          <main className="flex-1 relative flex flex-col min-w-0 bg-gradient-to-b from-transparent to-black/20">
            <ChatArea />
          </main>

          <ProfilePanel
            showProfile={showProfile}
            onClose={() => setShowProfile(false)}
            onEdit={() => setShowEditForm(true)}
            onDelete={handleDeleteAccount}
          />
        </div>

        {/* MODALS */}
        <EditProfileModal
          isOpen={showEditForm}
          onClose={() => setShowEditForm(false)}
        />
      </div>
    </div>
  );
};

export default ChatPage;