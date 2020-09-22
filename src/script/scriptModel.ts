import * as mongoose from "mongoose";
import { Script } from "./scriptInterface";
import * as uniqueValidator from "mongoose-unique-validator";

const scriptSchema = new mongoose.Schema({
  id: {
    type: String,
    unique: true,
  },
  script: {
    type: String,
    unique: true,
  },
});

scriptSchema.plugin(uniqueValidator, {
  message: "{VALUE} is already taken.",
});

const scriptModel = mongoose.model<Script & mongoose.Document>(
  "Scripts",
  scriptSchema
);

export default scriptModel;
