import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";

const ChatPage = () => {
  const { authUser, logout, updateUser } = useAuthStore();
  const {
    users,
    messages,
    selectedUser,
    getUsers,
    selectUser,
    sendMessage,
    initializeSocket,
    disconnectSocket,
    onlineUsers,
  } = useChatStore();

  const [text, setText] = useState("");
  const [showUsers, setShowUsers] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editForm, setEditForm] = useState({
    fullname: authUser?.fullname || "",
    email: authUser?.email || "",
    password: "",
    profilePic: null,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getUsers();
    // Initialize Socket.IO
    if (authUser?._id) {
      initializeSocket(authUser._id);
    }

    return () => {
      disconnectSocket();
    };
  }, [authUser?._id]);

  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
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

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let profilePic = authUser?.profilePic;

      // Convert image to base64 if new file is selected
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
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update profile");
      }

      updateUser(data.user);
      setShowEditForm(false);
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

  return (
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
          {users.map((user) => {
            const isOnline = onlineUsers.includes(user._id);
            return (
              <div
                key={user._id}
                onClick={() => {
                  selectUser(user);
                  setShowUsers(false);
                }}
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
                    <p className="text-xs text-gray-400 truncate">{user.email}</p>
                  </div>
                  {isOnline && (
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CHAT CENTER */}
      <div className="flex-1 flex flex-col">
        {/* HEADER */}
        <div className="h-16 flex items-center justify-center border-b border-white/10 bg-white/5 px-4">
          <h3 className="text-lg font-semibold tracking-wide text-center">
            {selectedUser?.fullname || "Select a chat"}
          </h3>
        </div>

        {/* MESSAGES */}
        <div className="flex-1 p-4 md:p-8 overflow-y-auto space-y-6">
          {!selectedUser ? (
            <div className="h-full flex items-center justify-center text-gray-400 text-sm">
              Select a chat to start messaging
            </div>
          ) : (
            messages.map((msg) => {
              const isMe = msg.sender === authUser._id;

              return (
                <div
                  key={msg._id}
                  className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[65%] px-4 py-3 md:px-5 md:py-3 rounded-3xl text-sm
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
            })
          )}
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
            className="w-full px-4 py-3 md:px-5 md:py-3 rounded-2xl bg-white/10
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
          {authUser.profilePic ? (
            <img
              src={authUser.profilePic}
              alt={authUser.fullname}
              className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover mb-4 border-2 border-fuchsia-500"
            />
          ) : (
            <div
              className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-linear-to-br
        from-fuchsia-500 to-purple-600 flex items-center
        justify-center text-2xl md:text-3xl font-bold mb-4"
            >
              {authUser.fullname?.[0]}
            </div>
          )}

          <h3 className="text-lg font-semibold">{authUser.fullname}</h3>
          <p className="text-sm text-gray-400 mb-6">{authUser.email}</p>

          <button
            onClick={() => setShowEditForm(true)}
            className="w-full py-2 rounded-xl bg-white/10 hover:bg-white/20 transition"
          >
            Edit Profile
          </button>

          <button
            onClick={logout}
            className="w-full py-2 rounded-xl bg-red-500 hover:bg-red-600 transition mt-3"
          >
            Logout
          </button>

          <button
            onClick={handleDeleteAccount}
            className="w-full py-2 rounded-xl bg-red-700 hover:bg-red-800 transition mt-2 text-sm"
          >
            Delete Account
          </button>
        </div>
      </div>

      {/* EDIT PROFILE MODAL */}
      {showEditForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 w-[90%] max-w-md">
            <h2 className="text-xl font-semibold mb-4 text-center">
              Edit Profile
            </h2>
            <form onSubmit={handleEditSubmit} className="space-y-4">
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
                  onClick={() => setShowEditForm(false)}
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
      )}
    </div>
  );
};

export default ChatPage;
