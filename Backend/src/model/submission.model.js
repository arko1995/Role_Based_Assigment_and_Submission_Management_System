import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema(
  {
    assignment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assignment",
      required: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    answer: {
      type: String,
      trim: true,
      required: true,
    },
    marks: {
      type: Number,
      min: 0,
    },
    feedback: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

submissionSchema.index(
  {
    assignment: 1,
    student: 1,
  },
  { unique: true },
);

const Submission = mongoose.model("Submission", submissionSchema);

export default Submission;
