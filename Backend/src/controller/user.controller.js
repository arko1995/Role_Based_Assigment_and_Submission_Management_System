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
  const { name, email, password, role, courses } = req.body();

  if (!name || !email || !password || !role || !courses) {
    res.status(400).json({
      success: false,
      message: "please provide all the necessary data",
    });
  }

  const exists = await User.findOne({ email });

  if (exists) {
    res.status(409).json({
      success: false,
      message: "Email already in use",
    });
  }

  const data = {
    name,
    email,
    password,
    role,
    courses,
  };

  await User.create(data);

  res.status(200).json({
    success: true,
    message: "User created successfully",
    data: data,
  });
};
