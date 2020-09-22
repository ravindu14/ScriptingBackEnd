import * as bodyParser from "body-parser";
import * as express from "express";
import * as mongoose from "mongoose";
import * as cors from "cors";

import Controller from "./shared/interfaces/controller.interface";
import errorMiddleware from "./shared/middleware/error.middleware";
import { MONGO_URI } from "./shared/config/mongodb";

export default class Init {
  public app: express.Application;

  constructor(controllers: Controller[]) {
    this.app = express();

    this.connectToTheDatabase();
    this.initializeMiddleware();
    this.initializeControllers(controllers);
    this.initializeErrorHandling();
  }

  private initializeMiddleware() {
    this.app.use(bodyParser.json());
    this.app.use(cors());
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }

  private initializeControllers(controllers: Controller[]) {
    controllers.map((controller) => this.app.use("/", controller.router));
  }

  public listen() {
    this.app.listen(process.env.PORT || 8080, () => {
      console.log(`Connected to ${process.env.PORT || 8080}`);
    });
  }

  private connectToTheDatabase() {
    mongoose
      .connect(MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
      })
      .then(() => console.log("MDB connected"))
      .catch((error) => console.log(error));
  }
}
