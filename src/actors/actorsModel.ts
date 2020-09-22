import * as mongoose from "mongoose";

const actorSchema = new mongoose.Schema(
  {
    actorId: {
      type: String,
      required: true,
    },
    actorName: {
      type: String,
      required: true,
    },
    freeDates: {
      type: Array,
    },
  },
  { _id: false, timestamps: { createdAt: true } }
);

const actorModel = mongoose.model<mongoose.Document>("actors", actorSchema);

export default actorModel;
