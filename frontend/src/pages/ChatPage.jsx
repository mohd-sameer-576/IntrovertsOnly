import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
const ChatPage = () => {
  const { authUser, logout } = useAuthStore();
  const { users, messages, selectedUser, getUsers, selectUser, sendMessage } =
    useChatStore();

  const [text, setText] = useState("");
  const [showUsers, setShowUsers] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    getUsers();
  }, []);

  return (
    // <Shell>
    <div
      className="h-[92vh] w-[95vw] mx-auto mt-4 rounded-[2.5rem]
bg-linear-to-br from-[#0b1220] via-[#0e1629] to-[#0b1220]
border border-fuchsia-500/40 shadow-[0_0_60px_-15px_rgba(217,70,239,0.6)]
flex overflow-hidden text-white relative"
    >
      {/* MOBILE TOP BAR */}
      <div className="absolute top-4 left-4 right-4 flex justify-between md:hidden">
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

      {/* USERS SIDEBAR */}
      <div
        className={`
    fixed md:static z-40 h-full w-[80%] md:w-[22%]
    bg-white/5 backdrop-blur-xl border-r border-white/10 p-5
    transition-transform duration-300
    ${showUsers ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
  `}
      >
        <h2 className="text-xl font-semibold mb-6">Chats</h2>
         <button
    onClick={() => setShowUsers(false)}
    className="md:hidden mb-4 px-4 py-2 rounded-xl bg-red-500"
  >
    Close
  </button>

        <div className="space-y-3">
          {users.map((user) => (
            <div
              key={user._id}
              onClick={() => {
                selectUser(user);
                setShowUsers(false);
              }}
              className={`p-4 rounded-2xl cursor-pointer transition
          ${
            selectedUser?._id === user._id
              ? "bg-white/15 shadow-md"
              : "hover:bg-white/10"
          }`}
            >
              <p className="font-medium">{user.fullname}</p>
              <p className="text-xs text-gray-400 truncate">{user.email}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CHAT CENTER */}
      <div className="flex-1 flex flex-col">
        {/* HEADER */}
        <div className="h-16 flex items-center justify-center border-b border-white/10 bg-white/5">
          <h3 className="text-lg font-semibold tracking-wide">
            {selectedUser?.fullname || "Select a chat"}
          </h3>
        </div>

        {/* MESSAGES */}
        <div className="flex-1 p-6 md:p-8 overflow-y-auto space-y-6">
          {messages.map((msg) => {
            const isMe = msg.sender === authUser._id;

            return (
              <div
                key={msg._id}
                className={`flex ${isMe ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] md:max-w-[65%] px-5 py-3 rounded-3xl text-sm
              ${
                isMe
                  ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-br-md"
                  : "bg-white/10 text-gray-100 rounded-bl-md"
              }`}
                >
                  <p>{msg.text}</p>
                  <span className="block mt-1 text-[10px] text-gray-300 text-right">
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* INPUT */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!text.trim()) return;
            sendMessage(text);
            setText("");
          }}
          className="p-4 md:p-6 border-t border-white/10 bg-white/5"
        >
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type a message…"
            className="w-full px-5 py-3 rounded-2xl bg-white/10
        placeholder-gray-400 text-white outline-none
        focus:ring-2 focus:ring-blue-500"
          />
        </form>
      </div>

      {/* PROFILE PANEL */}
      <div
        className={`
    fixed md:static right-0 z-40 h-full w-[80%] md:w-[22%]
    bg-white/5 backdrop-blur-xl border-l border-white/10 p-6
    transition-transform duration-300
    ${showProfile ? "translate-x-0" : "translate-x-full md:translate-x-0"}
  `}
      >
        <button
    onClick={() => setShowProfile(false)}
    className="md:hidden mb-4 px-4 py-2 rounded-xl bg-red-500"
  >
    Close
  </button>
          
        <div className="flex flex-col items-center">
          <div
            className="w-24 h-24 rounded-full bg-linear-to-br
      from-fuchsia-500 to-purple-600 flex items-center
      justify-center text-3xl font-bold mb-4"
          >
            {authUser.fullname?.[0]}
          </div>

          <h3 className="text-lg font-semibold">{authUser.fullname}</h3>
          <p className="text-sm text-gray-400 mb-6">{authUser.email}</p>

          <button className="w-full py-2 rounded-xl bg-white/10 hover:bg-white/20 transition">
            Edit Profile
          </button>

          <button
            onClick={logout}
            className="w-full py-2 rounded-xl bg-red-500 hover:bg-red-600 transition mt-3"
          >
            Logout
          </button>
          
        </div>
          
      </div>
    </div>
  );
};

export default ChatPage;
