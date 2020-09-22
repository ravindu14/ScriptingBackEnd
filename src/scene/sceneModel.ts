import * as mongoose from "mongoose";

const sceneSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      unique: true,
    },
    sceneNumber: {
      type: String,
      unique: true,
    },
    scriptId: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    dayPart: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    actors: {
      type: Array,
    },
    inventory: {
      type: Array,
    },
    crew: {
      type: Array,
    },
    stories: {
      type: Array,
    },
  },
  { _id: false, timestamps: { createdAt: true } }
);

const sceneModel = mongoose.model<mongoose.Document>("Scenes", sceneSchema);

export default sceneModel;
