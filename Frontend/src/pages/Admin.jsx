import React, { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import { useSubmissionStore } from "../store/submissionStore.js";
import { useUserStore } from "../store/userStore.js";
import { useAssignmentStore } from "../store/assignmentStore.js";

const emptyUserForm = {
  name: "",
  email: "",
  password: "",
  role: "student",
  course: "",
};

const emptyEditUserForm = {
  name: "",
  email: "",
  role: "student",
  course: "",
};

const emptyAssignmentForm = {
  title: "",
  description: "",
  course: "",
  subject: "",
  deadline: "",
  maxMarks: "",
};

const Admin = () => {
  const {
    users,
    loading: usersLoading,
    error: usersError,
    getUsers,
    createUser,
    updateUser,
    deleteUser,
  } = useUserStore();

  const {
    assignments,
    loading: assignmentsLoading,
    error: assignmentsError,
    getAssignments,
    updateAssignment,
    publishAssignment,
    deleteAssignment,
  } = useAssignmentStore();

  const {
    submissions,
    loading: submissionsLoading,
    error: submissionsError,
    getAllSubmissions,
  } = useSubmissionStore();

  const [userForm, setUserForm] = useState(emptyUserForm);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editUserForm, setEditUserForm] = useState(emptyEditUserForm);

  const [editingAssignmentId, setEditingAssignmentId] = useState(null);
  const [assignmentForm, setAssignmentForm] = useState(emptyAssignmentForm);

  const [message, setMessage] = useState("");

  useEffect(() => {
    getUsers().catch(() => {});
    getAssignments().catch(() => {});
    getAllSubmissions().catch(() => {});
  }, [getUsers, getAssignments, getAllSubmissions]);

  //user functions

  const handleUserFormChange = (e) => {
    setUserForm({
      ...userForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();

    if (userForm.role === "student" && !userForm.course.trim()) {
      return;
    }

    try {
      setMessage("");

      await createUser(
        userForm.name,
        userForm.email,
        userForm.password,
        userForm.role,
        userForm.role === "student" ? userForm.course : "",
      );

      setUserForm(emptyUserForm);
      setMessage("User created successfully");
    } catch (error) {}
  };

  const handleEditUser = (user) => {
    setEditingUserId(user._id);

    setEditUserForm({
      name: user.name || "",
      email: user.email || "",
      role: user.role || "student",
      course: user.course || "",
    });
  };

  const handleEditUserChange = (e) => {
    setEditUserForm({
      ...editUserForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();

    if (editUserForm.role === "student" && !editUserForm.course.trim()) {
      return;
    }

    try {
      setMessage("");

      await updateUser(editingUserId, {
        name: editUserForm.name,
        email: editUserForm.email,
        role: editUserForm.role,
        course: editUserForm.role === "student" ? editUserForm.course : "",
      });

      setEditingUserId(null);
      setEditUserForm(emptyEditUserForm);
      setMessage("User updated successfully");
    } catch (error) {}
  };

  const handleDeleteUser = async (userId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this user?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setMessage("");
      await deleteUser(userId);
      setMessage("User deleted successfully");
    } catch (error) {}
  };

  //assignment functions

  const handleEditAssignment = (assignment) => {
    setEditingAssignmentId(assignment._id);

    setAssignmentForm({
      title: assignment.title || "",
      description: assignment.description || "",
      course: assignment.course || "",
      subject: assignment.subject || "",
      deadline: assignment.deadline
        ? new Date(assignment.deadline).toISOString().slice(0, 16)
        : "",
      maxMarks: assignment.maxMarks ?? "",
    });
  };

  const handleAssignmentFormChange = (e) => {
    setAssignmentForm({
      ...assignmentForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdateAssignment = async (e) => {
    e.preventDefault();

    try {
      setMessage("");

      await updateAssignment(editingAssignmentId, {
        ...assignmentForm,
        maxMarks: Number(assignmentForm.maxMarks),
      });

      setEditingAssignmentId(null);
      setAssignmentForm(emptyAssignmentForm);
      setMessage("Assignment updated successfully");
    } catch (error) {}
  };

  const handlePublishAssignment = async (assignmentId) => {
    try {
      setMessage("");
      await publishAssignment(assignmentId);
      setMessage("Assignment published successfully");
    } catch (error) {}
  };

  const handleDeleteAssignment = async (assignmentId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this assignment?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setMessage("");
      await deleteAssignment(assignmentId);

      if (editingAssignmentId === assignmentId) {
        setEditingAssignmentId(null);
        setAssignmentForm(emptyAssignmentForm);
      }

      setMessage("Assignment deleted successfully");
    } catch (error) {}
  };

  // helpers for submission

  const getStudentName = (studentValue) => {
    const studentId =
      typeof studentValue === "object" ? studentValue?._id : studentValue;

    const student = users.find((user) => user._id === studentId);

    return student?.name || studentId || "Unknown student";
  };

  const getAssignmentTitle = (assignmentValue) => {
    const assignmentId =
      typeof assignmentValue === "object"
        ? assignmentValue?._id
        : assignmentValue;

    const assignment = assignments.find((item) => item._id === assignmentId);

    return assignment?.title || assignmentId || "Unknown assignment";
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <NavBar />

      <main className="mx-auto max-w-6xl px-6 py-8">
        <h2 className="text-2xl font-bold text-slate-900">Admin Dashboard</h2>

        <p className="mt-1 text-slate-500">
          Manage users, assignments, and submissions
        </p>

        {message && <p className="mt-4 text-sm text-green-600">{message}</p>}

        {/* CREATE USER */}

        <section className="mt-8">
          <h3 className="text-xl font-semibold text-slate-900">Create User</h3>

          <form
            onSubmit={handleCreateUser}
            className="mt-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <input
                name="name"
                value={userForm.name}
                onChange={handleUserFormChange}
                placeholder="Name"
                required
                className="rounded-lg border border-slate-300 p-3"
              />

              <input
                name="email"
                type="email"
                value={userForm.email}
                onChange={handleUserFormChange}
                placeholder="Email"
                required
                className="rounded-lg border border-slate-300 p-3"
              />

              <input
                name="password"
                type="password"
                value={userForm.password}
                onChange={handleUserFormChange}
                placeholder="Password"
                minLength="6"
                required
                className="rounded-lg border border-slate-300 p-3"
              />

              <select
                name="role"
                value={userForm.role}
                onChange={handleUserFormChange}
                className="rounded-lg border border-slate-300 p-3"
              >
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="admin">Admin</option>
              </select>

              {userForm.role === "student" && (
                <input
                  name="course"
                  value={userForm.course}
                  onChange={handleUserFormChange}
                  placeholder="Course"
                  required
                  className="rounded-lg border border-slate-300 p-3"
                />
              )}
            </div>

            {usersError && (
              <p className="mt-4 text-sm text-red-600">{usersError}</p>
            )}

            <button
              type="submit"
              disabled={usersLoading}
              className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-white disabled:opacity-50"
            >
              {usersLoading ? "Saving..." : "Create User"}
            </button>
          </form>
        </section>

        {/* USERS */}

        <section className="mt-10">
          <h3 className="text-xl font-semibold text-slate-900">Users</h3>

          {usersLoading && users.length === 0 && (
            <p className="mt-4 text-slate-500">Loading users...</p>
          )}

          {!usersLoading && users.length === 0 && (
            <p className="mt-4 text-slate-500">No users found.</p>
          )}

          <div className="mt-4 grid gap-4">
            {users.map((user) => (
              <div
                key={user._id}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                {editingUserId === user._id ? (
                  <form onSubmit={handleUpdateUser}>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <input
                        name="name"
                        value={editUserForm.name}
                        onChange={handleEditUserChange}
                        required
                        className="rounded-lg border border-slate-300 p-2"
                      />

                      <input
                        name="email"
                        type="email"
                        value={editUserForm.email}
                        onChange={handleEditUserChange}
                        required
                        className="rounded-lg border border-slate-300 p-2"
                      />

                      <select
                        name="role"
                        value={editUserForm.role}
                        onChange={handleEditUserChange}
                        className="rounded-lg border border-slate-300 p-2"
                      >
                        <option value="student">Student</option>
                        <option value="teacher">Teacher</option>
                        <option value="admin">Admin</option>
                      </select>

                      {editUserForm.role === "student" && (
                        <input
                          name="course"
                          value={editUserForm.course}
                          onChange={handleEditUserChange}
                          placeholder="Course"
                          required
                          className="rounded-lg border border-slate-300 p-2"
                        />
                      )}
                    </div>

                    <div className="mt-3 flex gap-2">
                      <button
                        type="submit"
                        className="rounded-lg bg-indigo-600 px-3 py-2 text-sm text-white"
                      >
                        Save
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setEditingUserId(null);
                          setEditUserForm(emptyEditUserForm);
                        }}
                        className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <p className="font-semibold text-slate-900">{user.name}</p>

                    <p className="text-sm text-slate-500">{user.email}</p>

                    <p className="mt-1 text-sm text-slate-500">
                      Role: {user.role}
                    </p>

                    {user.role === "student" && (
                      <p className="text-sm text-slate-500">
                        Course: {user.course}
                      </p>
                    )}

                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={() => handleEditUser(user)}
                        className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDeleteUser(user._id)}
                        className="rounded-lg bg-red-600 px-3 py-2 text-sm text-white"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ASSIGNMENTS */}

        <section className="mt-10">
          <h3 className="text-xl font-semibold text-slate-900">Assignments</h3>

          {assignmentsError && (
            <p className="mt-4 text-sm text-red-600">{assignmentsError}</p>
          )}

          {assignmentsLoading && assignments.length === 0 && (
            <p className="mt-4 text-slate-500">Loading assignments...</p>
          )}

          {editingAssignmentId && (
            <form
              onSubmit={handleUpdateAssignment}
              className="mt-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <h4 className="font-semibold text-slate-900">Edit Assignment</h4>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <input
                  name="title"
                  value={assignmentForm.title}
                  onChange={handleAssignmentFormChange}
                  placeholder="Title"
                  required
                  className="rounded-lg border border-slate-300 p-3"
                />

                <input
                  name="subject"
                  value={assignmentForm.subject}
                  onChange={handleAssignmentFormChange}
                  placeholder="Subject"
                  required
                  className="rounded-lg border border-slate-300 p-3"
                />

                <input
                  name="course"
                  value={assignmentForm.course}
                  onChange={handleAssignmentFormChange}
                  placeholder="Course"
                  required
                  className="rounded-lg border border-slate-300 p-3"
                />

                <input
                  name="maxMarks"
                  type="number"
                  min="1"
                  value={assignmentForm.maxMarks}
                  onChange={handleAssignmentFormChange}
                  placeholder="Maximum Marks"
                  required
                  className="rounded-lg border border-slate-300 p-3"
                />

                <input
                  name="deadline"
                  type="datetime-local"
                  value={assignmentForm.deadline}
                  onChange={handleAssignmentFormChange}
                  required
                  className="rounded-lg border border-slate-300 p-3"
                />
              </div>

              <textarea
                name="description"
                value={assignmentForm.description}
                onChange={handleAssignmentFormChange}
                placeholder="Description"
                rows="4"
                required
                className="mt-4 w-full rounded-lg border border-slate-300 p-3"
              />

              <div className="mt-4 flex gap-2">
                <button
                  type="submit"
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-white"
                >
                  Update Assignment
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setEditingAssignmentId(null);
                    setAssignmentForm(emptyAssignmentForm);
                  }}
                  className="rounded-lg border border-slate-300 px-4 py-2"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          <div className="mt-4 grid gap-4">
            {assignments.map((assignment) => (
              <div
                key={assignment._id}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex justify-between gap-4">
                  <div>
                    <p className="font-semibold text-slate-900">
                      {assignment.title}
                    </p>

                    <p className="text-sm text-slate-500">
                      {assignment.subject} • {assignment.course}
                    </p>
                  </div>

                  <span className="text-sm capitalize text-slate-500">
                    {assignment.status}
                  </span>
                </div>

                <p className="mt-3 text-sm text-slate-700">
                  {assignment.description}
                </p>

                <p className="mt-2 text-sm text-slate-500">
                  Deadline: {new Date(assignment.deadline).toLocaleString()}
                </p>

                <p className="text-sm text-slate-500">
                  Maximum Marks: {assignment.maxMarks}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    onClick={() => handleEditAssignment(assignment)}
                    className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  >
                    Edit
                  </button>

                  {assignment.status === "draft" && (
                    <button
                      onClick={() => handlePublishAssignment(assignment._id)}
                      className="rounded-lg bg-green-600 px-3 py-2 text-sm text-white"
                    >
                      Publish
                    </button>
                  )}

                  <button
                    onClick={() => handleDeleteAssignment(assignment._id)}
                    className="rounded-lg bg-red-600 px-3 py-2 text-sm text-white"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SUBMISSIONS */}

        <section className="mt-10 pb-10">
          <h3 className="text-xl font-semibold text-slate-900">
            All Submissions
          </h3>

          {submissionsError && (
            <p className="mt-4 text-sm text-red-600">{submissionsError}</p>
          )}

          {submissionsLoading && submissions.length === 0 && (
            <p className="mt-4 text-slate-500">Loading submissions...</p>
          )}

          {!submissionsLoading && submissions.length === 0 && (
            <p className="mt-4 text-slate-500">No submissions found.</p>
          )}

          <div className="mt-4 grid gap-4">
            {submissions.map((submission) => (
              <div
                key={submission._id}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <p className="font-semibold text-slate-900">
                  {getAssignmentTitle(submission.assignment)}
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Student: {getStudentName(submission.student)}
                </p>

                <p className="mt-4 text-sm text-slate-700">
                  Answer: {submission.answer}
                </p>

                <p className="mt-2 text-sm text-slate-500">
                  Marks:{" "}
                  {submission.marks !== undefined && submission.marks !== null
                    ? submission.marks
                    : "Not graded"}
                </p>

                <p className="text-sm text-slate-500">
                  Feedback: {submission.feedback || "No feedback"}
                </p>

                <p className="mt-2 text-xs text-slate-400">
                  Submitted: {new Date(submission.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Admin;
