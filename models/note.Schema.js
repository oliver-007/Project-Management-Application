// import mongoose from "mongoose";
import { Schema, model, models } from "mongoose";
// import User from "./user.Schema";

const noteSchema = new Schema(
  {
    creator_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    creator_name: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    priority: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    assigned_to: {
      type: Schema.Types.ObjectId,
      ref: "Team",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Note = models.Note || model("Note", noteSchema);
export default Note;
