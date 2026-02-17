import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { Send, Image as ImageIcon, Smile, MessageSquare } from "lucide-react";

const ChatArea = () => {
  const { authUser } = useAuthStore();
  const { selectedUser, messages, sendMessage } = useChatStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    const text = e.target.message.value;
    if (!text.trim()) return;
    sendMessage(text);
    e.target.message.value = "";
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-transparent">
      {/* HEADER: Added glass blur and better typography */}
      <div className="h-20 flex items-center px-8 border-b border-white/5 bg-white/[0.02] backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-blue-400 flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20">
            {selectedUser?.fullname?.[0] || "?"}
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">
              {selectedUser?.fullname || "Messenger"}
            </h3>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
              <p className="text-[10px] text-blue-400/80 font-bold uppercase tracking-widest">Active Now</p>
            </div>
          </div>
        </div>
      </div>

      {/* MESSAGES AREA */}
      <div className="flex-1 p-6 overflow-y-auto space-y-4">
        {!selectedUser ? (
          <div className="h-full flex flex-col items-center justify-center opacity-20">
            <MessageSquare className="w-16 h-16 text-white mb-4" />
            <p className="text-xs font-bold tracking-[0.2em] text-white uppercase">Start a new conversation</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.sender === authUser._id;
            return (
              <div key={msg._id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[70%] px-5 py-3 rounded-2xl text-sm transition-all
                  ${isMe 
                    ? "bg-blue-600 text-white rounded-tr-none shadow-lg shadow-blue-900/20" 
                    : "bg-white/5 border border-white/10 text-slate-200 rounded-tl-none"}
                `}>
                  <p>{msg.text}</p>
                  <span className="block mt-1 text-[10px] opacity-40 text-right uppercase font-bold">
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* INPUT BAR: Matches your login input style */}
      <form onSubmit={handleSubmit} className="p-6 bg-black/40 border-t border-white/5">
        <div className="relative max-w-4xl mx-auto group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 flex gap-3 text-slate-500">
            <Smile className="w-5 h-5 cursor-pointer hover:text-blue-400 transition-colors" />
            <ImageIcon className="w-5 h-5 cursor-pointer hover:text-blue-400 transition-colors" />
          </div>
          
          <input
            name="message"
            placeholder="Write your message..."
            className="w-full pl-24 pr-14 py-4 bg-[#1e293b]/30 border border-slate-700/50 rounded-2xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all"
          />

          <button 
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatArea;