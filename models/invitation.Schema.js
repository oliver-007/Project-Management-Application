import { Schema, model, models } from "mongoose";

const invitationSchema = new Schema(
  {
    senderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    teamId: {
      type: Schema.Types.ObjectId,
      ref: "Team",
      required: true,
    },
    invitationStatus: {
      type: String,
      enum: ["Pending", "Accepted", "Declined"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

const Invitation = models.Invitation || model("Invitation", invitationSchema);

export default Invitation;
