import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { 
  Menu, 
  User, 
  Settings2, 
  LogOut, 
  Send, 
  Search, 
  MoreVertical,
  ChevronLeft
} from "lucide-react"; 
import UsersSidebar from "../components/UsersSidebar";
import ChatArea from "../components/ChatArea";
import ProfilePanel from "../components/ProfilePanel";
import EditProfileModal from "../components/EditProfileModal";

const ChatPage = () => {
  const { authUser, logout } = useAuthStore();
  const { getUsers, initializeSocket, disconnectSocket, selectedUser } = useChatStore();

  const [showUsers, setShowUsers] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);

  useEffect(() => {
    getUsers();
    if (authUser?._id) {
      initializeSocket(authUser._id);
    }
    return () => {
      disconnectSocket();
    };
  }, [authUser?._id, getUsers, initializeSocket, disconnectSocket]);

  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you sure? This action is permanent.")) return;

    try {
      const response = await fetch("http://localhost:3000/api/auth/delete-account", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to delete account");
      alert("Account deleted successfully");
      logout();
    } catch (error) {
      alert(error.message || "An error occurred");
    }
  };

  return (
    <div className="h-screen w-full bg-[#05070a] text-slate-200 flex items-center justify-center p-0 md:p-4 lg:p-6 overflow-hidden font-sans">
      
      {/* BACKGROUND DECORATION */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-fuchsia-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

      {/* MAIN LAYOUT CONTAINER */}
      <div className="relative h-full w-full max-w-[1600px] flex overflow-hidden
                    bg-[#0b1220]/60 backdrop-blur-3xl 
                    border border-white/5 md:rounded-[2.5rem] 
                    shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-500">
        
        {/* MOBILE TOP NAVIGATION */}
        <div className="absolute top-0 left-0 right-0 h-16 flex items-center justify-between px-6 md:hidden z-50 bg-[#0b1220]/80 border-b border-white/5">
          <button 
            onClick={() => setShowUsers(true)}
            className="p-2 hover:bg-white/5 rounded-full transition-all active:scale-95"
          >
            <Menu className="w-5 h-5 text-fuchsia-400" />
          </button>
          
          <div className="flex flex-col items-center">
            <span className="text-xs font-bold tracking-[0.2em] text-fuchsia-500 uppercase">Nexus</span>
            <span className="text-[10px] text-white/40 uppercase tracking-widest">Chat</span>
          </div>

          <button 
            onClick={() => setShowProfile(true)}
            className="p-2 hover:bg-white/5 rounded-full transition-all active:scale-95"
          >
            <Settings2 className="w-5 h-5 text-blue-400" />
          </button>
        </div>

        {/* SIDEBARS & CONTENT AREA */}
        <div className="flex w-full h-full pt-16 md:pt-0">
          
          {/* USERS SIDEBAR WRAPPER */}
          <aside className={`
            absolute inset-y-0 left-0 z-40 w-80 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0
            ${showUsers ? "translate-x-0" : "-translate-x-full"}
            bg-[#0b1220] md:bg-transparent border-r border-white/5
          `}>
            <UsersSidebar onClose={() => setShowUsers(false)} />
          </aside>

          {/* MAIN CHAT WORKSPACE */}
          <main className="flex-1 flex flex-col min-w-0 bg-gradient-to-b from-transparent to-black/10">
            {selectedUser ? (
              <ChatArea />
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center space-y-4 opacity-40">
                <div className="w-20 h-20 rounded-full border-2 border-dashed border-fuchsia-500/30 flex items-center justify-center">
                  <Send className="w-8 h-8 text-fuchsia-500 rotate-12" />
                </div>
                <p className="text-sm tracking-widest uppercase">Select a conversation to begin</p>
              </div>
            )}
          </main>

          {/* PROFILE INFO PANEL */}
          <aside className={`
            absolute inset-y-0 right-0 z-40 w-80 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
            ${showProfile ? "translate-x-0" : "translate-x-full"}
            bg-[#0b1220] lg:bg-transparent border-l border-white/5
          `}>
            <ProfilePanel
              onClose={() => setShowProfile(false)}
              onEdit={() => setShowEditForm(true)}
              onDelete={handleDeleteAccount}
            />
          </aside>
        </div>

        {/* OVERLAYS & MODALS */}
        {showUsers && (
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden" 
            onClick={() => setShowUsers(false)} 
          />
        )}
        {showProfile && (
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden" 
            onClick={() => setShowProfile(false)} 
          />
        )}

        <EditProfileModal
          isOpen={showEditForm}
          onClose={() => setShowEditForm(false)}
        />
      </div>
    </div>
  );
};

export default ChatPage;