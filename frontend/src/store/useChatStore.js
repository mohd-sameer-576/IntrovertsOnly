import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

export const useChatStore = create((set, get) => ({
  users: [],
  messages: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

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
    set({ selectedUser: user, isMessagesLoading: true });
    const res = await axiosInstance.get(`/message/${user._id}`);
    set({ messages: res.data, isMessagesLoading: false });
  },

  sendMessage: async (text) => {
    const { selectedUser, messages } = get();

    const res = await axiosInstance.post(
      `/message/send/${selectedUser._id}`,
      { text }
    );

    set({ messages: [...messages, res.data] });
  },
}));
