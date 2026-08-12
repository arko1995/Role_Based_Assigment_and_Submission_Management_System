import React, { useState } from "react";
import NavBar from "../components/NavBar";
import { useEffect } from "react";
import { useAssignmentStore } from "../store/assignmentStore.js";
import { useSubmissionStore } from "../store/submissionStore.js";
const Student = () => {
  const {
    getAssignments,
    assignments,
    loading: assignmentsLoading,
    error: assignmentsError,
  } = useAssignmentStore();

  const {
    submissions,
    getMySubmissions,
    createSubmission,
    updateSubmission,
    loading: submissionsLoading,
    error: submissionsLoading,
  } = useSubmissionStore();

  useEffect(() => {
    getAssignments().catch(() => {});
    getMySubmissions().catch(() => {});
  }, [getAssignments, getMySubmissions]);

  const [message, setMessage] = useState("");
  const [answers, setAnswers] = useState({});

  const getSubmissionForAssignment = (assignmentId) => {
    return submissions.find((submission) => {
      const id =
        typeof submission.assignment === "object"
          ? submission.assignment._id
          : submission.assignment;

      return id === assignmentId;
    });
  };

  const handleSave = async (assignment) => {
    const existingSubmission = getSubmissionForAssignment(assignment);

    const answer = answers[assignment._id] ?? existingSubmission?.answer ?? "";

    if (!answer.trim()) {
      return;
    }

    try {
      setMessage("");

      if (existingSubmission) {
        await updateSubmission(existingSubmission._id, answer);
        setMessage("Answer updated successfully");
      } else {
        await createSubmission(assignment._id, answer);
        setMessage("Answer submitted successfully");
      }

      await getMySubmissions();
    } catch (error) {}
  };

  return (
    <div className=" min-h-screen bg-slate-50">
      <NavBar />
      <main className="mx-auto max-w-6xl px-6 py-8">
        <h2 className="text-2xl font-bold text-slate-900">Student Dashboard</h2>
        <p className="mt-1 text-slate-500">View and manage your assignments</p>

        {loading ? (
          <p className="mt-6 text-slate-500">Loading Assignments...</p>
        ) : null}

        {error ? <p className="mt-6 text-sm text-red-600">{error}</p> : null}

        {!loading && !error && assignments.length === 0 && (
          <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-slate-500">No assignments are available</p>
          </div>
        )}

        <div className="mt-6 grid gap-4">
          {assignments.map((assignment) => (
            <div
              key={assignment._id}
              className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    {assignment.title}
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    {assignment.subject}
                  </p>
                </div>
                <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
                  Published
                </span>
              </div>
              <p className="mt-4 text-sm text-slate-700">
                {assignment.description}
              </p>
              <div className="mt-4 grid gap-2 text-sm text-slate-500 sm:grid-cols-2">
                <p>
                  <span className="font-medium text-slate-700">Course:</span>{" "}
                  {assignment.course}
                </p>

                <p>
                  <span className="font-medium text-slate-700">
                    Maximum Marks:
                  </span>{" "}
                  {assignment.maxMarks}
                </p>

                <p>
                  <span className="font-medium text-slate-700">Teacher:</span>{" "}
                  {assignment.createdBy?.name}
                </p>

                <p>
                  <span className="font-medium text-slate-700">Deadline:</span>{" "}
                  {new Date(assignment.deadline).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Student;
