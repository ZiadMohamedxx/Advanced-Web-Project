import mongoose from "mongoose";

const ApplicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["submitted", "accepted", "rejected"],
      default: "submitted",
    },
    compatibilityScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
  },
  { timestamps: true }
);

// Prevent a candidate from applying to the same job twice
ApplicationSchema.index({ job: 1, candidate: 1 }, { unique: true });

const Application = mongoose.model("Application", ApplicationSchema);
export default Application;