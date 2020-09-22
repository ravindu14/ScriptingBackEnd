import {
  IsString,
  ValidateNested,
  IsNumber,
  IsDate,
  IsBoolean,
} from "class-validator";
import { Expose, Type } from "class-transformer";

export class ScheduleDto {
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
  public time: String;

  @Expose()
  @ValidateNested()
  public inventory: String[];

  @Expose()
  @ValidateNested()
  public dates: String[];
}

class SingleScheduleDto {
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
  public time: String;

  @Expose()
  @ValidateNested()
  public inventory: String[];

  @Expose()
  @ValidateNested()
  public dates: String[];

  @Expose()
  @ValidateNested()
  public fixedDate: String[];
}

export class FinalScheduleDto {
  @Expose()
  @IsString()
  public scriptId: String;

  @Expose()
  @Type(() => SingleScheduleDto)
  public schedule: SingleScheduleDto[];
}
