import Assignment from "../model/assignment.model.js";

export const createAssignment = async (req, res) => {
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
