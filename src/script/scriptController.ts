import * as express from "express";

import Controller from "../shared/interfaces/controller.interface";
import scriptModel from "./scriptModel";
import { plainToClass, plainToClassFromExist } from "class-transformer";
import { validate, Validator } from "class-validator";
import { ScriptDto } from "./scriptDto";

const validationOptions = {
  skipMissingProperties: true,
  whitelist: true,
  forbidNonWhitelisted: true,
};

export default class ScriptController implements Controller {
  public router = express.Router();
  private script = scriptModel;
  private path = "/script";

  constructor() {
    console.log("initialized");
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/save`, this.saveScript);
    this.router.get(`${this.path}/uniqueness`, this.checkIsUnique);
    this.router.get(`${this.path}/multiple`, this.getAllScripts);
  }

  private saveScript = async (
    request: express.Request,
    response: express.Response
  ) => {
    try {
      const scriptDto: ScriptDto = plainToClass(ScriptDto, request.body, {
        enableImplicitConversion: false,
      });

      const errors = await validate(scriptDto, validationOptions);
      if (errors.length > 0) {
        return response.status(400).json({
          success: false,
          data: {
            errorCode: 400,
            errorMessage: "Bad Request, Please refer documentation",
          },
        });
      }

      const newScript = await this.script.findOneAndUpdate(
        {
          id: scriptDto.id,
        },
        {
          $set: scriptDto,
        },
        { new: true, safe: true, upsert: true }
      );

      if (!newScript) {
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
        data: newScript,
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

  private checkIsUnique = async (
    request: express.Request,
    response: express.Response
  ) => {
    try {
      const script = await this.script.findOne({
        script: request.query.script,
      });

      if (!script) {
        return response.status(200).json({ success: true });
      }
      return response.status(200).json({ success: false });
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

  private getAllScripts = async (
    request: express.Request,
    response: express.Response
  ) => {
    const scripts = await this.script.find();

    if (!scripts) {
      return response.status(400).json({
        success: false,
        data: {
          errorCode: 400,
          errorMessage: "Bad request, please refer documentation",
        },
      });
    }

    return response.status(200).json({
      success: true,
      data: scripts,
    });
  };
}
