import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsOptional } from "class-validator";

export default class updateDto {
  @ApiProperty({ example: "mahmood" })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ type: "string", format: "binary", required: false })
  @IsOptional()
  avatar?: string;
}
