import Submission from "../model/submission.model.js";
import Assignment from "../model/assignment.model.js";
const createSubmission = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const { answer } = req.body;

    const assignment = await Assignment.findById(assignmentId);

    if (!answer || !answer.trim()) {
      return res.status(400).json({
        success: false,
        message: "Answer is required",
      });
    }
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

    const existingSubmission = await Submission.findOne({
      assignment: assignmentId,
      student: req.user.id,
    });

    if (existingSubmission) {
      return res.status(400).json({
        success: false,
        message: "This assignment has already been submitted",
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
      return res.status(404).json({
        success: false,
        message: "Submission not found",
      });
    }

    if (submission.student._id.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Authorization Blocked",
      });
    }

    const assignment = await Assignment.findById(submission.assignment);

    if (!assignment) {
      return res.status(404).json({
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

    await submission.save();

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

const getMySubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({
      student: req.user.id,
    }).populate("assignment", "title subject course deadline maxMarks");

    res.status(200).json({
      success: false,
      message: "Fetched submission data",
      data: submissions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const getAssignmentSubmissions = async (req, res) => {
  try {
    const { assignmentId } = req.params;

    const assignment = await Assignment.findById(assignmentId);

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "Assignment not found",
      });
    }

    if (req.user.role === "teacher") {
      if (assignment.createdBy.toString() !== req.user.id.toString()) {
        return res.status(403).json({
          success: false,
          message: "You don't have access to this document",
        });
      }
    }

    const submission = await Submission.findById({ assignment: assignmentId });

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: "This has not been submitted yet",
      });
    }

    res.status(200).json({
      success: true,
      message: "Submission data successfully fetched",
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

const getAllSubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find();

    if (!submissions) {
      return res.status(404).json({
        success: false,
        message: "No submission data found",
      });
    }

    res.status(200).json({
      success: true,
      message: "All submissions data fetched",
      data: submissions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const gradeSubmissions = async (req, res) => {
  try {
    const { submissionId } = req.params;

    const { marks } = req.body || {};

    const submission = await Submission.findById(submissionId);

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: "No submission found",
      });
    }

    const assignment = await Assignment.findById(submission.assignment);

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "This has not been submitted yet",
      });
    }

    if (assignment.createdBy._id.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    if (marks === undefined || marks < 0 || marks > assignment.maxMarks) {
      return res.status(400).json({
        success: false,
        message: `Marks must be between 0 and ${assignment.maxMarks}`,
      });
    }

    submission.marks = marks;

    await submission.save();

    res.status(200).json({
      success: true,
      message: "Submission graded successfully",
      data: submission,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export {
  createSubmission,
  updateSubmission,
  getMySubmissions,
  getAssignmentSubmissions,
  getAllSubmissions,
  gradeSubmissions,
};
