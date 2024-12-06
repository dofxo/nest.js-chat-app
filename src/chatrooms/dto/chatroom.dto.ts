import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsObject,
  IsUrl,
  IsDate,
  ValidateNested,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

// AuthorData DTO for validating the author object
class AuthorDataDto {
  @ApiProperty({ example: "محمد کارگر" })
  @IsString({ message: "نام باید یک رشته باشد" })
  @IsNotEmpty({ message: "نام نویسنده نباید خالی باشد" })
  name: string;

  @ApiProperty({
    example: "https://example.com/avatar.jpg",
    required: false,
  })
  @IsOptional()
  @IsString({ message: "آدرس تصویر باید یک رشته باشد" })
  @IsUrl({}, { message: "فرمت آدرس تصویر اشتباه است" })
  avatar?: string;
}

// CreateChatroomDto with validation
export class CreateChatroomDto {
  @ApiProperty({ example: "گفتگوی عمومی" })
  @IsString({ message: "نام اتاق باید یک رشته باشد" })
  @IsNotEmpty({ message: "نام اتاق نباید خالی باشد" })
  name: string;
}

// AddMessageDto with validation
export class AddMessageDto {
  @ApiProperty({ example: "سلام، چطورید؟" })
  @IsString({ message: "محتوای پیام باید یک رشته باشد" })
  @IsNotEmpty({ message: "محتوای پیام نباید خالی باشد" })
  content: string;

  @ApiProperty({
    example: { name: "محمد کارگر", avatar: "https://example.com/avatar.jpg" },
  })
  @IsObject({ message: "اطلاعات نویسنده باید یک شیء باشد" })
  @IsNotEmpty({ message: "اطلاعات نویسنده نباید خالی باشد" })
  @ValidateNested({ message: "اطلاعات نویسنده باید به درستی وارد شود" })
  authorData: AuthorDataDto;

  @ApiProperty({
    example: "2024-12-06T12:00:00Z",
    required: false,
  })
  @IsOptional()
  @IsDate({ message: "تاریخ باید یک تاریخ معتبر باشد" })
  date?: Date;
}
