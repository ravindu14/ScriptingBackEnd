import * as express from "express";

import Controller from "../shared/interfaces/controller.interface";
import inventoryModel from "./inventoryModel";
import { plainToClass, plainToClassFromExist } from "class-transformer";
import { validate } from "class-validator";
import { InventoryDto } from "./inventoryDto";

const validationOptions = {
  skipMissingProperties: true,
  whitelist: false,
  forbidNonWhitelisted: true,
};

export default class InventoryController implements Controller {
  public router = express.Router();
  private inventory = inventoryModel;
  private path = "/inventory";

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/save`, this.createOrUpdateInventory);
    this.router.get(`${this.path}/multiple/:scriptId`, this.getAllInventory);
  }

  private createOrUpdateInventory = async (
    request: express.Request,
    response: express.Response
  ) => {
    try {
      const inventoryDto: InventoryDto = plainToClass(
        InventoryDto,
        request.body,
        {
          enableImplicitConversion: false,
        }
      );

      const errors = await validate(inventoryDto, validationOptions);
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

      const updatedInventory = await this.inventory.findOneAndUpdate(
        {
          scriptId: inventoryDto.scriptId,
        },
        {
          $set: inventoryDto,
        },
        {
          new: true,
          upsert: true,
        }
      );

      const singleInventory = plainToClassFromExist(
        new InventoryDto(),
        updatedInventory.toJSON(),
        {
          excludeExtraneousValues: true,
        }
      );

      if (!singleInventory) {
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
        data: singleInventory,
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

  private getAllInventory = async (
    request: express.Request,
    response: express.Response
  ) => {
    try {
      const inventoryDetails = await this.inventory.find({
        scriptId: request.params.scriptId,
      });

      if (!inventoryDetails) {
        return response.status(400).json({
          success: false,
          data: {
            errorCode: 400,
            errorMessage: "Bad request, please refer documentation",
          },
        });
      }

      return response
        .status(200)
        .json({ success: true, data: inventoryDetails });
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
