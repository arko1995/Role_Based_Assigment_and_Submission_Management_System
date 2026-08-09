import Submission from "../model/submission.model.js";
import Assignment from "../model/assignment.model.js";
const createSubmission = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const { answer } = req.body;

    const assignment = await Assignment.findById(assignmentId);

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "Assignment not found",
      });
    }

    if (assignment.status !== "published") {
      return res.status(400).json({
        success: false,
        message: "Assignment is not published yet",
      });
    }

    if (assignment.course !== req.user.course) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    if (new Date() > assignment.deadline) {
      return res.status(400).json({
        success: false,
        message: "Submission date expired",
      });
    }

    const submittedAssignment = await Submission.create({
      assignment: assignmentId,
      student: req.user.id,
      answer,
    });

    res.status(201).json({
      success: true,
      message: "Document created successfully",
      data: submittedAssignment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const updateSubmission = async (req, res) => {
  try {
    const { submissionId } = req.params;
    const { answer } = req.body;

    if (!answer || !answer.trim()) {
      return res.status(400).json({
        success: false,
        message: "Answer is required",
      });
    }

    const submission = await Submission.findById(submissionId);

    if (!submission) {
      return res.status(400).json({
        success: false,
        message: "Submission not found",
      });
    }

    if (submission.student._id.toString() !== req.user.id.toString()) {
      return res.status(400).json({
        success: false,
        message: "Authorization Blocked",
      });
    }

    const assignment = await Assignment.findById(submission.assignment);

    if (!assignment) {
      return res.status(400).json({
        success: false,
        message: "Assignment not found",
      });
    }

    if (new Date() > assignment.deadline) {
      return res.status(400).json({
        success: false,
        message: "Deadline has expired for this assignment",
      });
    }

    submission.answer = answer;

    submission.save();

    res.status(200).json({
      success: true,
      message: "Submission successfully updated",
      data: submission,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export { createSubmission, updateSubmission };
