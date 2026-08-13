import { create } from "zustand";
import api from "../api/api.js";

export const useUserStore = create((set) => ({
  users: [],
  loading: false,
  error: null,

  getUsers: async () => {
    try {
      set({ loading: true, error: null });

      const response = await api.get("/users");
      const data = response.data.data;

      set({
        users: data,
        loading: false,
      });

      return data;
    } catch (error) {
      set({
        loading: false,
        error: error.response?.data?.message || "Unable to load users",
      });

      throw error;
    }
  },

  createUser: async (name, email, password, role, course) => {
    try {
      set({ loading: true, error: null });

      const response = await api.post("/users", {
        name,
        email,
        password,
        role,
        course,
      });

      const data = response.data.data;

      set((state) => ({
        users: [...state.users, { ...data, _id: data.id }],
        loading: false,
      }));

      return data;
    } catch (error) {
      set({
        loading: false,
        error: error.response?.data?.message || "Unable to create user",
      });

      throw error;
    }
  },

  updateUser: async (userId, updatedData) => {
    try {
      set({ loading: true, error: null });

      const response = await api.patch(`/users/${userId}`, updatedData);
      const data = response.data.data;

      set((state) => ({
        users: state.users.map((user) => (user._id === userId ? data : user)),
        loading: false,
      }));

      return data;
    } catch (error) {
      set({
        loading: false,
        error: error.response?.data?.message || "Unable to update user",
      });

      throw error;
    }
  },

  deleteUser: async (userId) => {
    try {
      set({ loading: true, error: null });

      const response = await api.delete(`/users/${userId}`);

      const data = response.data.data;

      set((state) => ({
        users: state.users.filter((user) => user._id !== userId),
        loading: false,
      }));

      return data;
    } catch (error) {
      set({
        loading: false,
        error: error.response?.data?.message || "Unable to delete user",
      });

      throw error;
    }
  },
}));
