import * as mongoose from "mongoose";

const inventorySchema = new mongoose.Schema(
  {
    scriptId: {
      type: String,
      required: true,
    },
    inventory: {
      type: Array,
    },
  },
  { _id: false, timestamps: { createdAt: true } }
);

const inventoryModel = mongoose.model<mongoose.Document>(
  "Inventory",
  inventorySchema
);

export default inventoryModel;
