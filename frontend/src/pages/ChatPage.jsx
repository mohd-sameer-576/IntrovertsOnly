import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { Menu, User, LogOut, MessageSquare, MoreVertical, Users, X } from "lucide-react";
import UsersSidebar from "../components/UsersSidebar";
import ChatArea from "../components/ChatArea";
import ProfilePanel from "../components/ProfilePanel";
import EditProfileModal from "../components/EditProfileModal";

const ChatPage = () => {
  const { authUser, logout } = useAuthStore();
  const { getUsers, initializeSocket, disconnectSocket } = useChatStore();

  // Controlled states for panels
  const [showUsers, setShowUsers] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    getUsers();
    if (authUser?._id) initializeSocket(authUser._id);
    return () => disconnectSocket();
  }, [authUser?._id, getUsers, initializeSocket, disconnectSocket]);

  const toggleUsers = () => {
    setShowUsers(!showUsers);
    setShowProfile(false); // Close profile if opening users
    setMobileMenuOpen(false);
  };

  const toggleProfile = () => {
    setShowProfile(!showProfile);
    setShowUsers(false); // Close users if opening profile
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen w-full bg-[#020617] flex flex-col md:items-center md:justify-center font-sans overflow-hidden">
      
      {/* MOBILE TOP NAVBAR */}
      <div className="md:hidden w-full h-16 px-6 flex items-center justify-between bg-slate-950/50 backdrop-blur-md border-b border-white/5 z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <MessageSquare className="text-white w-5 h-5" />
          </div>
          <span className="text-white font-bold tracking-tight">MESSENGER</span>
        </div>

        <div className="relative">
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-400 hover:text-white transition-colors"
          >
            {mobileMenuOpen ? <X /> : <MoreVertical />}
          </button>

          {/* Mobile Dropdown Menu */}
          {mobileMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-white/10 rounded-2xl shadow-2xl py-2 z-[60] animate-in fade-in zoom-in duration-200">
              <button onClick={toggleUsers} className="w-full flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-white/5">
                <Users className="w-5 h-5" /> Contacts
              </button>
              <button onClick={toggleProfile} className="w-full flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-white/5">
                <User className="w-5 h-5" /> Profile
              </button>
              <hr className="border-white/5 my-1" />
              <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10">
                <LogOut className="w-5 h-5" /> Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* MAIN CONTAINER */}
      <div className="relative h-[calc(100vh-64px)] md:h-[94vh] w-full max-w-[1600px] flex overflow-hidden 
                      bg-slate-950/40 backdrop-blur-3xl md:rounded-[2.5rem] border border-white/5 shadow-2xl">
        
        {/* DESKTOP SIDE RAIL */}
        <nav className="hidden md:flex w-20 flex-col items-center py-8 border-r border-white/5 bg-black/20 space-y-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <MessageSquare className="text-white w-6 h-6" />
          </div>
          <div className="flex-1 flex flex-col space-y-6">
            <button 
              onClick={toggleUsers} 
              className={`p-3 rounded-xl transition-all ${showUsers ? "bg-blue-500/10 text-blue-400" : "text-slate-500 hover:bg-white/5 hover:text-slate-300"}`}
            >
              <Users className="w-6 h-6" />
            </button>
            <button 
              onClick={toggleProfile} 
              className={`p-3 rounded-xl transition-all ${showProfile ? "bg-fuchsia-500/10 text-fuchsia-400" : "text-slate-500 hover:bg-white/5 hover:text-slate-300"}`}
            >
              <User className="w-6 h-6" />
            </button>
          </div>
          <button onClick={logout} className="p-3 rounded-xl text-slate-600 hover:text-red-400 transition-colors">
            <LogOut className="w-6 h-6" />
          </button>
        </nav>

        {/* DYNAMIC PANELS */}
        <div className="flex flex-1 h-full overflow-hidden relative">
          
          {/* Users Sidebar - Slide in from left */}
          <div className={`
            absolute md:relative z-100 h-full w-full md:w-[320px] transition-all duration-300 ease-in-out
            ${showUsers ? "translate-x-0" : "-translate-x-full md:hidden"}
          `}>
            <UsersSidebar showUsers={showUsers} onClose={() => setShowUsers(false)} />
          </div>
          
          {/* Main Chat Area */}
          <main className="flex-1 flex flex-col min-w-0 bg-gradient-to-b from-transparent to-black/10">
            <ChatArea />
          </main>

          {/* Profile Panel - Slide in from right */}
          <div className={`
            absolute md:relative right-0 z-40 h-full w-[280px] md:w-[320px] transition-all duration-300 ease-in-out
            ${showProfile ? "translate-x-0" : "translate-x-full md:hidden"}
          `}>
            <ProfilePanel 
              showProfile={showProfile} 
              onClose={() => setShowProfile(false)} 
              onEdit={() => setShowEditForm(true)} 
              onDelete={() => {}} // Connect your delete function
            />
          </div>
        </div>

        <EditProfileModal isOpen={showEditForm} onClose={() => setShowEditForm(false)} />
      </div>

    
    </div>
  );
};

export default ChatPage;