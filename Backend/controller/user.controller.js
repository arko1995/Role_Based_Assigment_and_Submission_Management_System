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
};
