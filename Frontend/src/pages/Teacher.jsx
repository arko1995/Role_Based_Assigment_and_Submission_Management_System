import React, { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import { useAssignmentStore } from "../store/assignmentStore";
import { useSubmissionStore } from "../store/submissionStore";

const Teacher = () => {
  const {
    assignments,
    loading,
    error,
    getAssignments,
    createAssignment,
    updateAssignment,
    publishAssignment,
    deleteAssignment,
  } = useAssignmentStore();

  const {
    submissions,
    loading: submissionsLoading,
    error: submissionsError,
    getAssignmentSubmissions,
    gradeSubmission,
  } = useSubmissionStore();

  const [form, setForm] = useState({
    title: "",
    description: "",
    course: "",
    subject: "",
    deadline: "",
    maxMarks: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [selectedAssignment, setSelectedAssignment] = useState(null);

  const [grades, setGrades] = useState({});
  const [message, setMessage] = useState("");

  useEffect(() => {
    getAssignments().catch(() => {});
  }, [getAssignments]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setMessage("");

      const data = {
        ...form,
        maxMarks: Number(form.maxMarks),
      };

      if (editingId) {
        await updateAssignment(editingId, data);
        setMessage("Assignment updated");
      } else {
        await createAssignment(data);
        setMessage("Assignment created");
      }

      setForm({
        title: "",
        description: "",
        course: "",
        subject: "",
        deadline: "",
        maxMarks: "",
      });

      setEditingId(null);
    } catch (error) {}
  };

  const handleEdit = (assignment) => {
    setEditingId(assignment._id);

    setForm({
      title: assignment.title,
      description: assignment.description,
      course: assignment.course,
      subject: assignment.subject,
      deadline: new Date(assignment.deadline).toISOString().slice(0, 16),
      maxMarks: assignment.maxMarks,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({
      title: "",
      description: "",
      course: "",
      subject: "",
      deadline: "",
      maxMarks: "",
    });
  };

  const handleViewSubmissions = async (assignment) => {
    try {
      setSelectedAssignment(assignment);

      await getAssignmentSubmissions(assignment._id);
    } catch (error) {}
  };

  const handleGrade = async (submissionId) => {
    const grade = grades[submissionId];

    if (!grade || grade.marks === "") {
      return;
    }

    try {
      await gradeSubmission(submissionId, grade.marks, grade.feedback || "");
      setMessage("Submission Graded");
    } catch (error) {}
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <NavBar />
      <main className="mx-auto max-w-6xl px-6 py-8">
        <h2 className="text-2xl font-bold text-slate-900">Teacher Dashboard</h2>
        <p className="mt-1 text-slate-500">
          Manage assignments and student submissions
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <h3 className="text-lg font-semibold text-slate-900">
            {editingId ? "Edit Assignment" : "Create Assignment"}
          </h3>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Title"
              required
              className="rounded-lg border border-slate-300 p-3"
            />

            <input
              name="subject"
              value={form.subject}
              onChange={handleChange}
              placeholder="Subject"
              required
              className="rounded-lg border border-slate-300 p-3"
            />

            <input
              name="course"
              value={form.course}
              onChange={handleChange}
              placeholder="Course"
              required
              className="rounded-lg border border-slate-300 p-3"
            />

            <input
              name="maxMarks"
              type="number"
              value={form.maxMarks}
              onChange={handleChange}
              placeholder="Maximum Marks"
              min="1"
              required
              className="rounded-lg border border-slate-300 p-3"
            />

            <input
              name="deadline"
              type="datetime-local"
              value={form.deadline}
              onChange={handleChange}
              required
              className="rounded-lg border border-slate-300 p-3"
            />
          </div>

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Assignment description"
            required
            rows="4"
            className="mt-4 w-full rounded-lg border border-slate-300 p-3"
          />

          <div className="mt-4 flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-white disabled:opacity-50"
            >
              {editingId ? "Update Assignment" : "Create Assignment"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={cancelEdit}
                className="rounded-lg border border-slate-300 px-4 py-2"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        <h3 className="mt-8 text-xl font-semibold text-slate-900">
          My Assignments
        </h3>

        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

        {message && <p className="mt-4 text-sm text-green-600">{message}</p>}

        <div className="mt-4 grid gap-4">
          {assignments.map((assignment) => (
            <div
              key={assignment._id}
              className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="flex justify-between gap-4">
                <div>
                  <h4 className="font-semibold text-slate-900">
                    {assignment.title}
                  </h4>

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
                Marks: {assignment.maxMarks}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  onClick={() => handleEdit(assignment)}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                >
                  Edit
                </button>

                {assignment.status === "draft" && (
                  <button
                    onClick={() =>
                      publishAssignment(assignment._id).catch(() => {})
                    }
                    className="rounded-lg bg-green-600 px-3 py-2 text-sm text-white"
                  >
                    Publish
                  </button>
                )}

                <button
                  onClick={() =>
                    deleteAssignment(assignment._id).catch(() => {})
                  }
                  className="rounded-lg bg-red-600 px-3 py-2 text-sm text-white"
                >
                  Delete
                </button>

                <button
                  onClick={() => handleViewSubmissions(assignment)}
                  className="rounded-lg bg-indigo-600 px-3 py-2 text-sm text-white"
                >
                  View Submissions
                </button>
              </div>
            </div>
          ))}
        </div>

        {selectedAssignment && (
          <div className="mt-8">
            <h3 className="text-xl font-semibold text-slate-900">
              Submissions — {selectedAssignment.title}
            </h3>

            {submissionsLoading && (
              <p className="mt-4 text-slate-500">Loading submissions...</p>
            )}

            {submissionsError && (
              <p className="mt-4 text-sm text-red-600">{submissionsError}</p>
            )}

            {!submissionsLoading && submissions.length === 0 && (
              <p className="mt-4 text-slate-500">No submissions yet.</p>
            )}

            <div className="mt-4 grid gap-4">
              {submissions.map((submission) => (
                <div
                  key={submission._id}
                  className="rounded-xl border border-slate-200 bg-white p-5"
                >
                  <p className="font-medium text-slate-900">
                    {submission.student?.name}
                  </p>

                  <p className="text-sm text-slate-500">
                    {submission.student?.email}
                  </p>

                  <p className="mt-4 text-slate-700">{submission.answer}</p>

                  <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                    <input
                      type="number"
                      min="0"
                      max={selectedAssignment.maxMarks}
                      value={
                        grades[submission._id]?.marks ?? submission.marks ?? ""
                      }
                      onChange={(e) =>
                        setGrades((previous) => ({
                          ...previous,
                          [submission._id]: {
                            ...previous[submission._id],
                            marks: e.target.value,
                          },
                        }))
                      }
                      placeholder="Marks"
                      className="rounded-lg border border-slate-300 p-2"
                    />

                    <input
                      value={
                        grades[submission._id]?.feedback ??
                        submission.feedback ??
                        ""
                      }
                      onChange={(e) =>
                        setGrades((previous) => ({
                          ...previous,
                          [submission._id]: {
                            ...previous[submission._id],
                            feedback: e.target.value,
                          },
                        }))
                      }
                      placeholder="Feedback"
                      className="flex-1 rounded-lg border border-slate-300 p-2"
                    />

                    <button
                      onClick={() => handleGrade(submission._id)}
                      className="rounded-lg bg-indigo-600 px-4 py-2 text-white"
                    >
                      Save Grade
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Teacher;
