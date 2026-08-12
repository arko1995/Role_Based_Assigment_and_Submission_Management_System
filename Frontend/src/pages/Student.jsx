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
    error: submissionsError,
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
    const existingSubmission = getSubmissionForAssignment(assignment._id);

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

        {submissionsError && (
          <p className="mt-4 text-sm text-red-600">{submissionsError}</p>
        )}

        {message && <p className="mt-4 text-sm text-green-600">{message}</p>}

        {assignmentsLoading ? (
          <p className="mt-6 text-slate-500">Loading Assignments...</p>
        ) : null}

        {assignmentsError ? (
          <p className="mt-6 text-sm text-red-600">{assignmentsError}</p>
        ) : null}

        {!assignmentsLoading &&
          !assignmentsError &&
          assignments.length === 0 && (
            <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-slate-500">No assignments are available</p>
            </div>
          )}

        <div className="mt-6 grid gap-4">
          {assignments.map((assignment) => {
            const existingSubmission = getSubmissionForAssignment(
              assignment._id,
            );

            const answer =
              answers[assignment._id] ?? existingSubmission?.answer ?? "";

            const deadlinePassed = new Date() > new Date(assignment.deadline);

            return (
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
                    <span className="font-medium text-slate-700">
                      Deadline:
                    </span>{" "}
                    {new Date(assignment.deadline).toLocaleString()}
                  </p>
                </div>
                <div className="mt-5">
                  <label className="text-sm font-medium text-slate-700">
                    Your Answer
                  </label>

                  <textarea
                    value={answer}
                    onChange={(e) =>
                      setAnswers((previous) => ({
                        ...previous,
                        [assignment._id]: e.target.value,
                      }))
                    }
                    disabled={deadlinePassed}
                    rows="4"
                    placeholder="Write your answer here..."
                    className="mt-2 w-full rounded-lg border border-slate-300 p-3"
                  />

                  {deadlinePassed && (
                    <p className="mt-2 text-sm text-red-600">
                      Deadline has passed.
                    </p>
                  )}

                  {!deadlinePassed && (
                    <button
                      onClick={() => handleSave(assignment)}
                      disabled={submissionsLoading || !answer.trim()}
                      className="mt-3 rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 disabled:opacity-50"
                    >
                      {existingSubmission ? "Update Answer" : "Submit Answer"}
                    </button>
                  )}

                  {existingSubmission && (
                    <p className="mt-2 text-sm text-green-600">Submitted</p>
                  )}

                  {existingSubmission && (
                    <div className="mt-4 border-t border-slate-200 pt-4">
                      <p className="text-sm font-medium text-slate-700">
                        Marks:{" "}
                        {existingSubmission.marks !== undefined &&
                        existingSubmission.marks !== null
                          ? `${existingSubmission.marks} / ${assignment.maxMarks}`
                          : "Not graded yet"}
                      </p>

                      {existingSubmission.feedback && (
                        <p className="mt-2 text-sm text-slate-600">
                          Feedback: {existingSubmission.feedback}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default Student;
