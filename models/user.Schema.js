import mongoose, { Schema } from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      lowerecase: true,
      required: true,
    },

    password: {
      type: String,
      required: true,
    },

    assigned_to_team_id: {
      type: Schema.Types.ObjectId,
      ref: "Team",
      default: false,
    },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
