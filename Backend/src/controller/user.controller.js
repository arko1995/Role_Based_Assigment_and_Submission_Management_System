import User from "../model/user.model.js";

const getUser = async (req, res) => {
  try {
    const data = await User.find();

    if (!data) {
      res.status(204).json({
        success: false,
        message: "no user in database",
      });
    }

    res.status(200).json({
      success: true,
      message: "All user data fetched",
      data: data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error,
    });
  }
};

const createUser = async (req, res) => {
  try {
    const { name, email, password, role, course } = req.body;

    if (!name || !email || !password || !role) {
      res.status(400).json({
        success: false,
        message: "please provide all the necessary data",
      });
      return;
    }

    const allowedRole = ["teacher", "admin", "student"];

    if (!allowedRole.includes(role)) {
      res.status(400).json({
        success: false,
        message: "Please select a valid role",
      });
      return;
    }

    if (role === "student" && !course) {
      res.status(400).json({
        success: false,
        message: "please choose a course",
      });
      return;
    }

    const trimmedMail = email.trim().toLowerCase();

    const exists = await User.findOne({ email: trimmedMail });

    if (exists) {
      res.status(409).json({
        success: false,
        message: "Email already in use",
      });
      return;
    }

    const newUser = {
      name,
      email: trimmedMail,
      password,
      role,
      course,
    };

    const createdUser = await User.create(newUser);

    const data = {
      id: createdUser._id,
      name: createdUser.name,
      email: createdUser.email,
      role: createdUser.role,
      course: createdUser.course,
    };

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: data,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error,
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    const { name, email, role, password, course } = req.body || {};

    const user = await User.findById(id);

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    if (password !== undefined) {
      return res.status(400).json({
        success: false,
        message: "Password cannot be updated here",
      });
    }

    let updates = {};

    if (name !== undefined) updates.name = name.trim();
    if (email !== undefined) updates.email = email.trim().toLowerCase();
    if (role !== undefined) updates.role = role.trim().toLowerCase();
    if (course !== undefined) updates.course = course.trim();

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid information provided to update",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(id, updates, {
      runValidators: true,
      new: true,
    });

    res.status(200).json({
      success: true,
      message: "user updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error,
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const deletedUser = await User.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
      data: deletedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export { createUser, getUser, updateUser, deleteUser };
