import mongoose from "mongoose";

const googleUserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
      lowerecase: true,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const GoogleUser =
  mongoose.models.Googleuser || mongoose.model("Googleuser", googleUserSchema);

export default GoogleUser;
