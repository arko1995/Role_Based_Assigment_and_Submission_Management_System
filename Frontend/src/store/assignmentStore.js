import { create } from "zustand";
import api from "../api/api.js";

export const useAssignmentStore = create((set) => ({
  assignments: [],
  selectedAssignment: null,
  loading: false,
  error: null,

  getAssignments: async () => {
    try {
      set({ loading: true, error: null });

      const response = await api.get("/assignment");

      set({
        assignments: response.data.data,
        loading: true,
      });
    } catch (error) {
      set({
        loading: false,
        error: error.response?.data?.message || "Could not load assignments",
      });
    }
  },

  getAssignment: async (id) => {
    try {
      set({ loading: true, error: null });

      const response = await api.get(`/assignment/${id}`);

      set({
        selectedAssignment: response.data.data,
        loading: false,
      });
    } catch (error) {
      set({
        loading: false,
        error: error.response?.data?.message || "Could not load assignment",
      });
    }
  },

  createAssignment: async (data) => {
    try {
      set({ loading: true, error: null });
      const response = await api.post("/assignment", data);

      set((state) => {
        assignments = [...state.assignments, response.data.data];
      });
      set({ loading: false });
      return response.data;
    } catch (error) {
      set({
        loading: false,
        error: error.response?.data?.message || "Assignment creation failed",
      });
    }
  },

  updateAssignment: async (id, data) => {
    try {
      set({ loading: true, error: null });

      const response = api.patch(`/assignment/${id}`, data);

      set((state) => {
        assignments: state.assignments.map((assignment) =>
          assignment.id === id ? response.data.data : assignment,
        );
      });

      set({ loading: false });

      return response.data;
    } catch (error) {
      set({
        loading: false,
        error: error.response?.data?.message || "Failed to update assignment",
      });
    }
  },

  publishAssignment: async (id) => {
    try {
      set({ loading: false, error: null });

      const response = await api.patch(`/assignment/${id}/publish`);

      set((state) => {
        assignments: state.assignments.map((assignment) =>
          assignment.id === id ? response.data.data : assignment,
        );
      });

      set({ loading: false });

      return response.data;
    } catch (error) {
      set({
        loading: false,
        error: error.response?.data?.message || "Failed publishing assignment",
      });
    }
  },

  deleteAssignment: async (id) => {
    try {
      set({ loading: false, error: null });

      const response = await api.delete(`/assignment/${id}`);

      set((state) => {
        assignments: state.assignments.filter(
          (assignment) => assignment.id !== id,
        );
      });

      set({ loading: false });
    } catch (error) {
      set({
        loading: false,
        error: error.response?.data?.message || "Failed to delete assignment",
      });
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));
