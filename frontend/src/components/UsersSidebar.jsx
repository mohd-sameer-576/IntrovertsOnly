import { useState, useMemo } from "react";
import { useChatStore } from "../store/useChatStore";

const UsersSidebar = ({ showUsers, onClose }) => {
  const { users, selectedUser, selectUser, onlineUsers } = useChatStore();
  const [activeTab, setActiveTab] = useState("friends");

  // Separate users into friends (with chat history) and all users
  const { friendsWithChat, usersWithoutChat } = useMemo(() => {
    const friendsWithChat = [];
    const usersWithoutChat = [];

    users.forEach((user) => {
      // Check if there's any message exchange with this user
      // We'll fetch chat history to determine this
      if (user.hasChat) {
        friendsWithChat.push(user);
      } else {
        usersWithoutChat.push(user);
      }
    });

    return { friendsWithChat, usersWithoutChat };
  }, [users]);

  const handleSelectUser = (user) => {
    selectUser(user);
    onClose();
  };

  const displayUsers =
    activeTab === "friends" ? friendsWithChat : usersWithoutChat;

  return (
    <div
      className={`
    fixed md:static z-40 h-full w-[80%] md:w-full
    bg-white/5 backdrop-blur-xl border-r border-white/10 p-5
    transition-transform duration-300
    ${showUsers ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
  `}
    >
      <h2 className="text-xl font-semibold mb-6">Chats</h2>
      <button
        onClick={onClose}
        className="md:hidden mb-4 px-4 py-2 rounded-xl bg-red-500"
      >
        Close
      </button>

      {/* Tabs */}
      <div className="flex gap-2 mb-4 border-b border-white/10">
        <button
          onClick={() => setActiveTab("friends")}
          className={`pb-2 px-2 transition ${
            activeTab === "friends"
              ? "text-blue-400 border-b-2 border-blue-400"
              : "text-gray-400 hover:text-gray-300"
          }`}
        >
          Friends ({friendsWithChat.length})
        </button>
        <button
          onClick={() => setActiveTab("all")}
          className={`pb-2 px-2 transition ${
            activeTab === "all"
              ? "text-blue-400 border-b-2 border-blue-400"
              : "text-gray-400 hover:text-gray-300"
          }`}
        >
          All Users ({usersWithoutChat.length})
        </button>
      </div>

      {/* Users List */}
      <div className="space-y-3">
        {displayUsers.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-4">
            {activeTab === "friends"
              ? "No friends yet. Start a chat!"
              : "No users available"}
          </p>
        ) : (
          displayUsers.map((user) => {
            const isOnline = onlineUsers.includes(user._id);
            return (
              <div
                key={user._id}
                onClick={() => handleSelectUser(user)}
                className={`p-4 rounded-2xl cursor-pointer transition relative
            ${
              selectedUser?._id === user._id
                ? "bg-white/15 shadow-md"
                : "hover:bg-white/10"
            }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{user.fullname}</p>
                    <p className="text-xs text-gray-400 truncate">
                      {user.email}
                    </p>
                  </div>
                  {isOnline && (
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default UsersSidebar;
