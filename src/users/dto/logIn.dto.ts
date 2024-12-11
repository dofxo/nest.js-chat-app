import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsEmail, IsNotEmpty } from "class-validator";

export default class logInDto {
  @ApiProperty({ example: "kargat504@gmail.com" })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: "mkmkmkmk4444" })
  @IsString()
  @IsNotEmpty()
  password: string;
}
