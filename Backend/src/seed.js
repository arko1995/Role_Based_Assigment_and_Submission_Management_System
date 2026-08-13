import dotenv from "dotenv";
import mongoose from "mongoose";

import { connectDB } from "./lib/db.js";
import User from "./model/user.model.js";

dotenv.config();

const seedUsers = async () => {
  try {
    await connectDB();

    const demoEmails = [
      "testemail@gmail.com",
      "testteacheremail@gmail.com",
      "teststudentemail@gmail.com",
    ];

    // Remove old demo accounts if they already exist
    await User.deleteMany({
      email: { $in: demoEmails },
    });

    await User.create([
      {
        name: "test",
        email: "testemail@gmail.com",
        password: "test1234",
        role: "admin",
      },
      {
        name: "testteacher",
        email: "testteacheremail@gmail.com",
        password: "test1234",
        role: "teacher",
      },
      {
        name: "teststudent",
        email: "teststudentemail@gmail.com",
        password: "test1234",
        role: "student",
        course: "testCourse",
      },
    ]);

    console.log("Demo users created successfully");

    console.log(`
Admin:
testemail@gmail.com
test1234

Teacher:
testteacheremail@gmail.com
test1234

Student:
teststudentemail@gmail.com
test1234
`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Failed to seed demo users:", error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

seedUsers();
