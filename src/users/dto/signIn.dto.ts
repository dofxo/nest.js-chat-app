import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsEmail, IsNotEmpty } from "class-validator";

export default class signInDto {
  @ApiProperty({ example: "mahmood@gmail.com" })
  @IsNotEmpty({ message: "ایمیل نباید خالی باشد" })
  @IsEmail({}, { message: "فرمت ایمیل اشتباه می باشد" })
  email: string;

  @ApiProperty({ example: "1234mkmkmk" })
  @IsString({ message: "پسوورد باید رشته باشد" })
  @IsNotEmpty({ message: "داشتن پسوورد الزامی است" })
  password: string;
}
