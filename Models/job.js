import mongoose from "mongoose";

const JobSchema = new mongoose.Schema(
  {
    employer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      default: "",
    },
    workType: {
      type: String,
      enum: ["remote", "onsite", "hybrid"],
      default: "onsite",
    },
    requiredSkills: {
      type: [String],
      default: [],
    },
    physicalRequirements: {
      type: String,
      default: "",
    },
    disabilityAccommodations: {
      type: String,
      default: "",
    },
    industry: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["open", "closed"],
      default: "open",
    },
  },
  { timestamps: true }
);

const Job = mongoose.model("Job", JobSchema);
export default Job;