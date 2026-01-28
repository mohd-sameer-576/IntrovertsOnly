import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { getSocket, initSocket } from "../lib/socket";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  users: [],
  messages: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  onlineUsers: [],

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/message/allUsers");
      set({ users: res.data });
    } finally {
      set({ isUsersLoading: false });
    }
  },

  selectUser: async (user) => {
    set({ selectedUser: user, messages: [], isMessagesLoading: true });
    const res = await axiosInstance.get(`/message/${user._id}`);
    set({ messages: res.data, isMessagesLoading: false });
  },

  clearChat: () => set({ selectedUser: null, messages: [] }),

  sendMessage: async (text) => {
    const { selectedUser, messages } = get();
    const { authUser } = useAuthStore.getState();

    try {
      // Save to database
      const res = await axiosInstance.post(
        `/message/send/${selectedUser._id}`,
        { text }
      );

      // Send via Socket.IO for real-time
      const socket = getSocket();
      if(socket) {
        socket.emit('sendMessage', {
          receiverId: selectedUser._id,
          senderId: authUser._id,
          text,
          image: null
        })
      }

      set({ messages: [...messages, res.data] });
    } catch (error) {
      console.error("Error sending message:", error);
    }
  },

  initializeSocket: (userId) => {
    const socket = initSocket(userId);
    
    // Listen for online users
    socket.on('getOnlineUsers', (users) => {
      set({ onlineUsers: users });
    })
    
    // Listen for incoming messages
    socket.on('receiveMessage', (data) => {
      const { selectedUser, messages } = get();
      
      // Only add if from selected user
      if(selectedUser && data.senderId === selectedUser._id) {
        set({ messages: [...messages, data] });
      }
    })
  },

  disconnectSocket: () => {
    const socket = getSocket();
    if(socket) {
      socket.disconnect();
    }
  }
}));
