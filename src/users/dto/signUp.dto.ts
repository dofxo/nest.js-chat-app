import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsEmail, IsNotEmpty, Validate } from "class-validator";
import { MatchPasswordsConstraint } from "src/validators";

export default class signUpDto {
  @ApiProperty({ example: "mahmood" })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: "mahmood@gmail.com" })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: "1234mkmkmk" })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ example: "1234mkmkmk" })
  @IsString()
  @IsNotEmpty()
  @Validate(MatchPasswordsConstraint)
  confirmPassword: string;
}
