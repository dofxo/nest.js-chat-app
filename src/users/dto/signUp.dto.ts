import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsEmail, IsNotEmpty, Validate } from "class-validator";
import { MatchPasswordsConstraint } from "src/validators";

export default class signUpDto {
  @ApiProperty({ example: "mahmood" })
  @IsString({ message: "نام باید رشته باشد" })
  @IsNotEmpty({ message: "نام نباید خالی باشد" })
  name: string;

  @ApiProperty({ example: "mahmood@gmail.com" })
  @IsNotEmpty({ message: "ایمیل نباید خالی باشد" })
  @IsEmail({}, { message: "فرمت ایمیل اشتباه می باشد" })
  email: string;

  @ApiProperty({ example: "1234mkmkmk" })
  @IsString({ message: "پسوورد باید رشته باشد" })
  @IsNotEmpty({ message: "داشتن پسوورد الزامی است" })
  password: string;

  @ApiProperty({ example: "1234mkmkmk" })
  @IsString({ message: "پسوورد باید رشته باشد" })
  @IsNotEmpty({ message: "داشتن پسوورد الزامی است" })
  @Validate(MatchPasswordsConstraint)
  confirmPassword: string;
}
