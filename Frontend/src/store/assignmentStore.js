import { create } from "zustand";
import api from "../api/api.js";

export const useAssignmentStore = create((set) => {
  assignments: [];
  selectedAssignment: null;
  loading: false;
  error: null;

  getAssignments: async () => {
    try {
      set({ loading: true, error: null });

      const response = await api.get("/assignment");

      set({
        assignments: response.data,
        loading: true,
      });
    } catch (error) {
      set({
        loading: false,
        error: error.response?.data?.message || "Could not load assignments",
      });
    }
  };

  getAssignment: (id) => {
    try {
      set({ loading: true, error: null });

      const response = api.get(`/assignment/${id}`);

      set({
        selectedAssignment: response.data,
        loading: false,
      });
    } catch (error) {
      set({
        loading: false,
        error: error.response?.data?.message || "Could not load assignment",
      });
    }
  };
});
