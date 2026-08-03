import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      minlength: 6,
      required: true,
      select: false,
    },
    role: {
      type: String,
      enum: ["teacher", "admin", "student"],
      required: true,
    },
    course: {
      type: String,
      default: null,
      trim: true,
      required: () => {
        this.role === "student";
      },
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre("save", async () => {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

const User = mongoose.model("User", userSchema);

export default User;
