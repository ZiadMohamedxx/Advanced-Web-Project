import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["candidate", "corporate"],
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      default: "",
    },

    disabilityType: {
      type: String,
      default: "",
    },
    preferredAccommodations: {
      type: String,
      default: "",
    },
    cvPath: {
      type: String,
      default: null,
    },

    companyName: {
      type: String,
      default: "",
    },
    contactFirstName: {
      type: String,
      default: "",
    },
    contactLastName: {
      type: String,
      default: "",
    },
    industry: {
      type: String,
      default: "",
    },
    companySize: {
      type: String,
      default: "",
    },

    profileImage: {
      type: String,
      default: "",
    },
    resetPasswordToken: {
  type: String,
},

resetPasswordExpire: {
  type: Date,
},
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", UserSchema);

export default User;