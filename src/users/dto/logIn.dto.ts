import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsEmail, IsNotEmpty } from "class-validator";

export default class logInDto {
  @ApiProperty({ example: "kargat504@gmail.com" })
  @IsNotEmpty({ message: "ایمیل نباید خالی باشد" })
  @IsEmail({}, { message: "فرمت ایمیل اشتباه می باشد" })
  email: string;

  @ApiProperty({ example: "mkmkmkmk4444" })
  @IsString({ message: "پسوورد باید رشته باشد" })
  @IsNotEmpty({ message: "داشتن پسوورد الزامی است" })
  password: string;
}
