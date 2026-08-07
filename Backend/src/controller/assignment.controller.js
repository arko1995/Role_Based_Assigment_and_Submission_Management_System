import Assignment from "../model/assignments.model.js";

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

export { createAssignment, getAssignment };
