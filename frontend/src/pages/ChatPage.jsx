import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { Menu, User, Settings2, Trash2, LogOut, MessageSquare } from "lucide-react";
import UsersSidebar from "../components/UsersSidebar";
import ChatArea from "../components/ChatArea";
import ProfilePanel from "../components/ProfilePanel";
import EditProfileModal from "../components/EditProfileModal";

const ChatPage = () => {
  const { authUser, logout } = useAuthStore();
  const { getUsers, initializeSocket, disconnectSocket } = useChatStore();

  const [showUsers, setShowUsers] = useState(true); // Default to true for desktop
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
    <div className="min-h-screen w-full bg-[#020617] p-0 md:p-6 flex items-center justify-center font-sans overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 blur-[120px] animate-pulse pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-fuchsia-600/10 blur-[120px] animate-pulse delay-700 pointer-events-none" />

      {/* Main Glass Container */}
      <div className="relative h-screen md:h-[94vh] w-full max-w-[1600px] flex overflow-hidden 
                      bg-slate-950/40 backdrop-blur-3xl md:rounded-[2.5rem] border border-white/5 
                      shadow-2xl">
        
        {/* 1. Side Navigation Rail */}
        <nav className="hidden md:flex w-20 flex-col items-center py-8 border-r border-white/5 bg-black/20 space-y-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <MessageSquare className="text-white w-6 h-6" />
          </div>
          <div className="flex-1 flex flex-col space-y-6">
            <button 
              onClick={() => {setShowUsers(true); setShowProfile(false)}} 
              className={`p-3 rounded-xl transition-all ${showUsers ? "bg-blue-500/10 text-blue-400" : "text-slate-500 hover:bg-white/5 hover:text-slate-300"}`}
            >
              <Menu className="w-6 h-6" />
            </button>
            <button 
              onClick={() => {setShowProfile(true); setShowUsers(false)}} 
              className={`p-3 rounded-xl transition-all ${showProfile ? "bg-fuchsia-500/10 text-fuchsia-400" : "text-slate-500 hover:bg-white/5 hover:text-slate-300"}`}
            >
              <User className="w-6 h-6" />
            </button>
          </div>
          <button onClick={logout} className="p-3 rounded-xl text-slate-600 hover:text-red-400 transition-colors">
            <LogOut className="w-6 h-6" />
          </button>
        </nav>

        {/* 2. Content Area */}
        <div className="flex flex-1 h-full overflow-hidden relative">
          <UsersSidebar showUsers={showUsers} onClose={() => setShowUsers(false)} />
          
          <main className="flex-1 flex flex-col min-w-0 bg-gradient-to-b from-transparent to-black/20">
            <ChatArea />
          </main>

          <ProfilePanel 
            showProfile={showProfile} 
            onClose={() => setShowProfile(false)} 
            onEdit={() => setShowEditForm(true)} 
            onDelete={handleDeleteAccount} 
          />
        </div>

        {/* Mobile View Toggle (Overlay for mobile users) */}
        <div className="md:hidden fixed bottom-6 right-6 z-50 flex gap-3">
            <button onClick={() => setShowUsers(!showUsers)} className="p-4 bg-blue-600 rounded-full shadow-lg text-white"><Menu /></button>
            <button onClick={() => setShowProfile(!showProfile)} className="p-4 bg-fuchsia-600 rounded-full shadow-lg text-white"><User /></button>
        </div>

        <EditProfileModal isOpen={showEditForm} onClose={() => setShowEditForm(false)} />
      </div>
    </div>
  );
};

export default ChatPage;