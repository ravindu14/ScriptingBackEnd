import { IsString, IsArray } from "class-validator";
import { Expose } from "class-transformer";

export class ScriptDto {
  @Expose()
  @IsString()
  public id: String;

  @Expose()
  @IsString()
  public script: String;
}
