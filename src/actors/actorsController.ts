import * as express from "express";

import Controller from "../shared/interfaces/controller.interface";
import actorsModel from "./actorsModel";
import { plainToClass, plainToClassFromExist } from "class-transformer";
import { validate } from "class-validator";
import { ActorsDto } from "./actorsDto";

const validationOptions = {
  skipMissingProperties: true,
  whitelist: false,
  forbidNonWhitelisted: true,
};

export default class ActorController implements Controller {
  public router = express.Router();
  private actors = actorsModel;
  private path = "/actors";

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/save`, this.createOrUpdateActors);
    this.router.get(`${this.path}/multiple`, this.getAllActors);
  }

  private createOrUpdateActors = async (
    request: express.Request,
    response: express.Response
  ) => {
    try {
      const actorsDto: ActorsDto = plainToClass(ActorsDto, request.body, {
        enableImplicitConversion: false,
      });

      const errors = await validate(actorsDto, validationOptions);

      if (errors.length > 0) {
        return response.status(400).json({
          success: false,
          data: {
            errorCode: 400,
            errorMessage: "Bad Request, Please refer documentation",
          },
        });
      }

      const updatedActors = await this.actors.findOneAndUpdate(
        {
          actorId: actorsDto.actorId,
        },
        {
          $set: actorsDto,
        },
        {
          new: true,
          upsert: true,
        }
      );

      const singleActor = plainToClassFromExist(
        new ActorsDto(),
        updatedActors.toJSON(),
        {
          excludeExtraneousValues: true,
        }
      );

      if (!singleActor) {
        return response.status(400).json({
          success: false,
          data: {
            errorCode: 400,
            errorMessage: "Bad request, please refer documentation",
          },
        });
      }

      return response.status(201).json({
        success: true,
        data: singleActor,
      });
    } catch (error) {
      return response.status(500).json({
        success: false,
        data: {
          errorCode: 500,
          error,
          errorMessage: "Internal Server Error",
        },
      });
    }
  };

  private getAllActors = async (
    request: express.Request,
    response: express.Response
  ) => {
    try {
      const actorsDetails = await this.actors.find();

      if (!actorsDetails) {
        return response.status(400).json({
          success: false,
          data: {
            errorCode: 400,
            errorMessage: "Bad request, please refer documentation",
          },
        });
      }

      return response.status(200).json({ success: true, data: actorsDetails });
    } catch (error) {
      return response.status(500).json({
        success: false,
        data: {
          errorCode: 500,
          error,
          errorMessage: "Internal Server Error",
        },
      });
    }
  };
}
