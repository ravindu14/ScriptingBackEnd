import * as express from "express";

import Controller from "../shared/interfaces/controller.interface";
import sceneModel from "./sceneModel";
import { plainToClass, plainToClassFromExist } from "class-transformer";
import { validate } from "class-validator";
import { ScriptSceneDto } from "./scriptSceneDto";

const validationOptions = {
  skipMissingProperties: true,
  whitelist: false,
  forbidNonWhitelisted: true,
};

export default class SceneController implements Controller {
  public router = express.Router();
  private scene = sceneModel;
  private path = "/scene";

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/save`, this.createOrUpdateScene);
    this.router.get(`${this.path}/multiple/:scriptId`, this.getAllScenes);
  }

  private createOrUpdateScene = async (
    request: express.Request,
    response: express.Response
  ) => {
    try {
      const sceneDto: ScriptSceneDto = plainToClass(
        ScriptSceneDto,
        request.body,
        {
          enableImplicitConversion: false,
        }
      );

      const errors = await validate(sceneDto, validationOptions);
      console.log(errors);
      if (errors.length > 0) {
        return response.status(400).json({
          success: false,
          data: {
            errorCode: 400,
            errorMessage: "Bad Request, Please refer documentation",
          },
        });
      }

      const updatedScene = await this.scene.findOneAndUpdate(
        {
          scriptId: sceneDto.scriptId,
          id: sceneDto.id,
        },
        {
          $set: sceneDto,
        },
        {
          new: true,
          upsert: true,
        }
      );

      const singleScene = plainToClassFromExist(
        new ScriptSceneDto(),
        updatedScene.toJSON(),
        {
          excludeExtraneousValues: true,
        }
      );

      if (!singleScene) {
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
        data: singleScene,
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

  private getAllScenes = async (
    request: express.Request,
    response: express.Response
  ) => {
    try {
      const scriptScenes = await this.scene.find({
        scriptId: request.params.scriptId,
      });

      if (!scriptScenes) {
        return response.status(400).json({
          success: false,
          data: {
            errorCode: 400,
            errorMessage: "Bad request, please refer documentation",
          },
        });
      }

      return response.status(200).json({ success: true, data: scriptScenes });
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
