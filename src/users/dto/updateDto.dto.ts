import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty } from "class-validator";

export default class updateDto {
  @ApiProperty({ example: "mahmood" })
  @IsString({ message: "نام باید رشته باشد" })
  @IsNotEmpty({ message: "نام نباید خالی باشد" })
  name: string;
}
