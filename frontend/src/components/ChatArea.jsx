import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";

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
    <div className="flex-1 flex flex-col">
      {/* HEADER */}

      <div className="h-16 flex items-center justify-center border-b border-white/10 bg-white/5 px-4">
        <h3 className="text-lg font-semibold tracking-wide text-center">
          {selectedUser?.fullname || "Select a chat"}
        </h3>
      </div>

      {/* messaegs  */}

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
                ? "bg-linear-to-br from-blue-500 to-blue-600 text-white rounded-br-md"
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

        onSubmit={handleSubmit}
        className="p-4 md:p-6 border-t border-white/10 bg-white/5"
      >
        <input
          name="message"
          placeholder="Type a message…"
          className="w-full px-4 py-3 md:px-5 md:py-3 rounded-2xl bg-white/10
        placeholder-gray-400 text-white outline-none
        focus:ring-2 focus:ring-blue-500"
        />
      </form>
    </div>
  );
};

export default ChatArea;
