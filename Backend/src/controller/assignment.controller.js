import Assignment from "../model/assignment.model.js";

const createAssignment = async (req, res) => {
  try {
    const { title, description, course, subject, deadline, maxMarks } =
      req.body || {};

    if (
      !title ||
      !description ||
      !course ||
      !subject ||
      !deadline ||
      !maxMarks
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all the required information",
      });
    }

    const createdAssignment = await Assignment.create({
      title,
      description,
      course,
      subject,
      deadline,
      maxMarks,
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Assignment created successfully",
      data: createdAssignment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const getAssignment = async (req, res) => {
  try {
    let filter = {};

    if (req.user.role === "teacher") {
      filter.createdBy = req.user.id;
    }

    if (req.user.role === "student") {
      filter.status = "published";
      filter.course = req.user.course;
    }

    const assignments = await Assignment.find(filter).populate(
      "createdBy",
      "name email",
    );

    res.status(200).json({
      success: true,
      message: "assignments data fetched",
      data: assignments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const getAssignmentById = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id).populate(
      "createdBy",
      "name email",
    );

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "Assignment not found",
      });
    }

    if (req.user.role === "teacher") {
      if (assignment.createdBy._id.toString() !== req.user.id.toString()) {
        return res.status(403).json({
          success: false,
          message: "Unauthorized access",
        });
      }
    }

    if (req.user.role === "student") {
      if (
        assignment.status !== "published" ||
        assignment.course !== req.user.course
      ) {
        return res.status(403).json({
          success: false,
          message: "Unauthorized access",
        });
      }
    }

    res.status(200).json({
      success: true,
      message: "assignment data fetched",
      data: assignment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const updateAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id).populate(
      "createdBy",
      "name email",
    );

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "Data not available",
      });
    }

    const roles = ["teacher", "admin"];

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    if (
      req.user.role === "teacher" &&
      assignment.createdBy._id.toString() !== req.user.id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    const { title, description, course, subject, deadline, maxMarks } =
      req.body || {};

    const updatedAssignment = await Assignment.findByIdAndUpdate(
      req.params.id,
      { title, description, course, subject, deadline, maxMarks },
      { runValidators: true, new: true },
    );

    res.status(200).json({
      success: true,
      message: "Document updated successfully",
      data: updatedAssignment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const deleteAssignment = async (req, res) => {
  try {
    const { id } = req.params;

    const assignment = await Assignment.findById(id);

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    if (
      req.user.role === "teacher" &&
      assignment.createdBy._id.toString() !== req.user.id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    const deletedAssignment = await Assignment.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Document deleted successfully",
      data: deletedAssignment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export {
  createAssignment,
  getAssignment,
  getAssignmentById,
  updateAssignment,
  deleteAssignment,
};
