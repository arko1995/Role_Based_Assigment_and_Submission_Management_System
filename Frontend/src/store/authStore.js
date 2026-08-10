import { create } from "zustand";
import api from "../api/api.js";

const savedUser = localStorage.getItem("user");

export const useAuthStore = create((set) => {
  user: savedUser ? JSON.parse(savedUser) : null;
  loading: null;
  error: null;

  login: async (email, password) => {
    try {
      set({ loading: true, error: null });

      const response = await api.post("/auth/login", { email, password });

      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      set({
        user: user,
        loading: false,
      });

      return user;
    } catch (error) {
      set({
        loading: false,
        error: error.response?.data?.message || "Login Failed",
      });
    }
  };

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    set({
      user: null,
      error: null,
    });
  };

  clearError: () => {
    set({ error: null });
  };
});
