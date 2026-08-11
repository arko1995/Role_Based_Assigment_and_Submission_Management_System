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
        loading: false,
      });
    } catch (error) {
      set({
        loading: false,
        error: error.response?.data?.message || "Could not load assignments",
      });
      throw error;
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
      throw error;
    }
  },

  createAssignment: async (data) => {
    try {
      set({ loading: true, error: null });
      const response = await api.post("/assignment", data);

      set((state) => ({
        assignments: [...state.assignments, response.data.data],
      }));
      set({ loading: false });
      return response.data.data;
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

      const response = await api.patch(`/assignment/${id}`, data);

      set((state) => ({
        assignments: state.assignments.map((assignment) =>
          assignment._id === id ? response.data.data : assignment,
        ),
      }));

      set({ loading: false });

      return response.data.data;
    } catch (error) {
      set({
        loading: false,
        error: error.response?.data?.message || "Failed to update assignment",
      });
      throw error;
    }
  },

  publishAssignment: async (id) => {
    try {
      set({ loading: true, error: null });

      const response = await api.patch(`/assignment/${id}/publish`);

      set((state) => ({
        assignments: state.assignments.map((assignment) =>
          assignment._id === id ? response.data.data : assignment,
        ),
      }));

      set({ loading: false });

      return response.data.data;
    } catch (error) {
      set({
        loading: false,
        error: error.response?.data?.message || "Failed publishing assignment",
      });
      throw error;
    }
  },

  deleteAssignment: async (id) => {
    try {
      set({ loading: true, error: null });

      const response = await api.delete(`/assignment/${id}`);

      set((state) => ({
        assignments: state.assignments.filter(
          (assignment) => assignment._id !== id,
        ),
      }));

      set({ loading: false });
    } catch (error) {
      set({
        loading: false,
        error: error.response?.data?.message || "Failed to delete assignment",
      });
      throw error;
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));
