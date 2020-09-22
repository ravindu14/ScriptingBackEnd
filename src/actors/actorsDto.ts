import { IsString } from "class-validator";
import { Expose } from "class-transformer";

export class ActorsDto {
  @Expose()
  @IsString()
  public actorId: String;

  @Expose()
  @IsString()
  public actorName: String;

  @Expose()
  public freeDates: string[];
}
