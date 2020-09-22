import { IsString, ValidateNested, IsNumber, IsBoolean } from "class-validator";
import { Expose, Type } from "class-transformer";

export class InventoryTable {
  @Expose()
  @IsString()
  public itemId: string;

  @Expose()
  @IsString()
  public itemName: string;

  @Expose()
  @IsNumber()
  public amount: number;

  @Expose()
  @IsBoolean()
  public availability: boolean;

  @Expose()
  @IsNumber()
  public cost: number;
}

export class InventoryDto {
  @Expose()
  @IsString()
  public scriptId: String;

  @Expose()
  @Type(() => InventoryTable)
  @ValidateNested()
  public inventory: InventoryTable[];
}
