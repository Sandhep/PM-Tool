import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const activityLogSchema = new mongoose.Schema(
  {
    logId: { type: String, default: uuidv4, unique: true, index: true },

    resourceType: {
      type: String,
      enum: ["Workspace","Project", "Task"],
      required: true,
    },

    resourceId: { type: String, required: true },

    actionType: {
      type: String,
      enum: ["CREATED", "UPDATED", "DELETED"],
      required: true,
    },

    description: { type: String, required: true },

    initiatedBy: { type: String, ref: "User", required: true },
  },
  { timestamps: true } // adds createdAt, updatedAt
);

export default mongoose.model("ActivityLog", activityLogSchema);
