import { create } from "zustand";
import api from "../api/api.js";

export const useSubmissionStore = create((set) => ({
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
        { answer },
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

      const response = await api.patch(`/submissions/${submissionId}`, {
        answer,
      });

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

  getAssignmentSubmissions: async (assignmentId) => {
    try {
      set({ loading: true, error: null });

      const response = await api.get(`/submissions/assignment/${assignmentId}`);

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

  gradeSubmission: async (submissionId, marks, feedback) => {
    try {
      set({ loading: true, error: null });

      const response = await api.patch(`/submissions/${submissionId}/grade`, {
        marks: Number(marks),
        feedback,
      });

      set((state) => ({
        submissions: state.submissions.map((submission) =>
          submission._id === submissionId
            ? { ...response.data.data, student: submission.student }
            : submission,
        ),
        loading: false,
      }));

      return response.data.data;
    } catch (error) {
      set({
        loading: false,
        error: error.response?.data?.message || "Could not grade submission",
      });

      throw error;
    }
  },

  getAllSubmissions: async () => {
    try {
      set({ loading: true, error: null });

      const response = await api.get("/submissions");
      const data = response.data.data;

      set({ submissions: data, loading: false });

      return data;
    } catch (error) {
      set({
        loading: false,
        error:
          error.response?.data?.message || "Unable to load all submissions",
      });

      throw error;
    }
  },
}));
