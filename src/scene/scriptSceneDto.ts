import {
  IsString,
  ValidateNested,
  IsNumber,
  IsDate,
  IsBoolean,
} from "class-validator";
import { Expose, Type } from "class-transformer";

export class CrewDto {
  @Expose()
  @IsString()
  public employeeId: string;

  @Expose()
  @IsString()
  public employeeName: string;

  @Expose()
  @IsNumber()
  public pricePerDay: number;

  @Expose()
  @IsBoolean()
  public presentStatus: boolean;
}

export class StoryDto {
  @Expose()
  @IsString()
  public storyId: string;

  @Expose()
  @IsString()
  public shot: string;

  @Expose()
  @IsString()
  public image: string;
}

export class ActorsDto {
  @Expose()
  @IsString()
  public actorId: string;

  @Expose()
  @IsString()
  public actorName: string;
}

export class InventoryDto {
  @Expose()
  @IsString()
  public itemId: string;

  @Expose()
  @IsString()
  public itemName: string;

  @Expose()
  @IsNumber()
  public price: number;
}

export class ScriptSceneDto {
  @Expose()
  @IsString()
  public id: String;

  @Expose()
  @IsString()
  public sceneNumber: String;

  @Expose()
  @IsString()
  public scriptId: String;

  @Expose()
  @IsString()
  public location: String;

  @Expose()
  @IsString()
  public dayPart: String;

  @Expose()
  @IsString()
  public description: String;

  @Expose()
  @IsString()
  public time: String;

  @Expose()
  @Type(() => ActorsDto)
  @ValidateNested()
  public actors: ActorsDto[];

  @Expose()
  @Type(() => InventoryDto)
  @ValidateNested()
  public inventory: InventoryDto[];

  @Expose()
  @Type(() => CrewDto)
  @ValidateNested()
  public crew: CrewDto[];

  @Expose()
  @Type(() => StoryDto)
  @ValidateNested()
  public stories: StoryDto[];

  @Expose()
  @IsString()
  public weatherstatus: String;
}
