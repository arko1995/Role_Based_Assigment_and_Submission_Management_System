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

    if (assignment.status === published) {
      return res.status(400).json({
        success: false,
        message: "Assignment already published",
      });
    }

    if (assignment.course !== req.user.course) {
      return res.status(400).json({
        success: false,
        message: "Unauthorized access",
      });
    }
  } catch (error) {}
};
