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
    console.error("Error fetching data", error);
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
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
