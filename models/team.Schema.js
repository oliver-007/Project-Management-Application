import mongoose, { Schema } from "mongoose";

const teamSchema = new mongoose.Schema(
  {
    creator_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    creator_name: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

const Team = mongoose.models.Team || mongoose.model("Team", teamSchema);

export default Team;
