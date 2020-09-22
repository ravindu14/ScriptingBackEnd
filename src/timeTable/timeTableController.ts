import * as express from "express";

import Controller from "../shared/interfaces/controller.interface";
import sceneModel from "../scene/sceneModel";
import { plainToClass, plainToClassFromExist } from "class-transformer";
import { validate } from "class-validator";
import { ScheduleDto, FinalScheduleDto } from "./timeTableDto";
import { ScriptSceneDto } from "../scene/scriptSceneDto";
import actorsModel from "../actors/actorsModel";
import { ActorsDto } from "../actors/actorsDto";
import ScheduleModel from "./timeTableModel";

const validationOptions = {
  skipMissingProperties: true,
  whitelist: false,
  forbidNonWhitelisted: true,
};

export default class ScheduleController implements Controller {
  public router = express.Router();
  private scene = sceneModel;
  private actor = actorsModel;
  private schedule = ScheduleModel;
  private path = "/schedule";

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/:scriptId`, this.getSchedule);
    this.router.post(`${this.path}/save`, this.createOrUpdateSchedule);
  }

  private getFreeDates = (dateList) => {
    let result = [];
    let lists = dateList;

    for (let i = 0; i < lists.length; i++) {
      let currentList = lists[i];
      for (let y = 0; y < currentList.length; y++) {
        let currentValue = currentList[y];
        if (result.indexOf(currentValue) === -1) {
          if (
            lists.filter(function (obj) {
              return obj.indexOf(currentValue) == -1;
            }).length == 0
          ) {
            result.push(currentValue);
          }
        }
      }
    }
    return result;
  };

  private getSchedule = async (
    request: express.Request,
    response: express.Response
  ) => {
    try {
      const scriptScenes: ScriptSceneDto[] = await this.scene.find({
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

      const actorsInScenes: ActorsDto[] = await this.actor.find();

      let schedule = scriptScenes.map((scene) => {
        let newSchedule = new ScheduleDto();

        newSchedule.dayPart = scene.dayPart;
        newSchedule.inventory = scene.inventory.map(({ itemName }) => itemName);
        newSchedule.location = scene.location;
        newSchedule.sceneNumber = scene.sceneNumber;
        newSchedule.scriptId = scene.scriptId;
        newSchedule.time = scene.time;

        let selectedActors: ActorsDto[] = scene.actors.map(({ actorId }) => {
          let actor = actorsInScenes.filter(
            (actor) => actor.actorId === actorId
          );
          return actor[0];
        });

        let toBeSelectedDates = [];

        selectedActors.map((actor) => {
          toBeSelectedDates.push(actor.freeDates);
        });
        newSchedule.dates = this.getFreeDates(toBeSelectedDates);

        return newSchedule;
      });

      return response.status(200).json({ success: true, data: schedule });
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

  private createOrUpdateSchedule = async (
    request: express.Request,
    response: express.Response
  ) => {
    try {
      const scheduleDto: FinalScheduleDto = plainToClass(
        FinalScheduleDto,
        request.body,
        {
          enableImplicitConversion: false,
        }
      );

      const errors = await validate(scheduleDto, validationOptions);

      if (errors.length > 0) {
        return response.status(400).json({
          success: false,
          data: {
            errorCode: 400,
            errorMessage: "Bad Request, Please refer documentation",
            error: errors,
          },
        });
      }

      const updatedSchedule = await this.schedule.findOneAndUpdate(
        {
          scriptId: scheduleDto.scriptId,
        },
        {
          $set: scheduleDto,
        },
        {
          new: true,
          upsert: true,
        }
      );

      const singleSchedule = plainToClassFromExist(
        new FinalScheduleDto(),
        updatedSchedule.toJSON(),
        {
          excludeExtraneousValues: true,
        }
      );

      if (!singleSchedule) {
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
        data: singleSchedule,
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
}
