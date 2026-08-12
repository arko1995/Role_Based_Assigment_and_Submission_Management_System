import { create } from "zustand";
import api from "../api/api.js";

const useSubmissionStore = create((set) => ({
  submissions: [],
  loading: false,
  error: null,

  getMySubmissions: async () => {
    try {
      set({ loading: true, error: null });

      const response = await api.get("/submissions/my");
      const data = response.data.data;
      set({ submissions: data, loading: false });

      return data;
    } catch (error) {
      set({
        loading: false,
        error: error.response?.data?.message || "Could not load submissions",
      });

      throw error;
    }
  },

  createSubmission: async (assignmentId, answer) => {
    try {
      set({ loading: true, error: null });

      const response = await api.post(
        `/submissions/assignment/${assignmentId}`,
        answer,
      );

      const data = response.data.data;

      set({ loading: false });

      return data;
    } catch (error) {
      set({
        loading: false,
        error: error.response?.data?.message || "Could not submit answer",
      });

      throw error;
    }
  },

  updateSubmission: async (submissionId, answer) => {
    try {
      set({ loading: true, error: null });

      const response = await api.patch(`/submissions/${submissionId}`, answer);

      set({ loading: false });

      return response.data.data;
    } catch (error) {
      set({
        loading: false,
        error: error.response?.data?.message || "Could not update submission",
      });

      throw error;
    }
  },
}));
