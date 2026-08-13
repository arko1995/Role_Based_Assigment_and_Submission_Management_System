import React from "react";
import NavBar from "../components/NavBar";
import { useState, useEffect } from "react";
import { useSubmissionStore } from "../store/submissionStore.js";
import { useUserStore } from "../store/userStore.js";
import { useAssignmentStore } from "../store/assignmentStore.js";

const Admin = () => {
  const { users, getUsers, createUser, updateUser, deleteUser } =
    useUserStore();

  const {
    assignments,
    getAssignments,
    updateAssignment,
    publishAssignment,
    deleteAssignment,
  } = useAssignmentStore();

  const { submissions, getAllSubmissions } = useSubmissionStore();

  useEffect(() => {
    getUsers();
    getAssignments();
    getAllSubmissions();
  }, [getUsers, getAssignments, getAllSubmissions]);

  const [userForm, setUserForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
    course: "",
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <NavBar />
      <main className="mx-auto max-w-6xl px-6 py-8">
        <h2 className="text-2xl font-bold text-slate-900">Admin Dashboard</h2>
        <p className="mt-1 text-slate-500">Manage admin panel</p>
      </main>
    </div>
  );
};

export default Admin;
