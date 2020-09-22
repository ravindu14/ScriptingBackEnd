import * as mongoose from "mongoose";

const scheduleSchema = new mongoose.Schema(
  {
    scriptId: {
      type: String,
      required: true,
    },
    schedule: {
      type: Array,
    },
  },
  { _id: false, timestamps: { createdAt: true } }
);

const scheduleModel = mongoose.model<mongoose.Document>(
  "Schedule",
  scheduleSchema
);

export default scheduleModel;
