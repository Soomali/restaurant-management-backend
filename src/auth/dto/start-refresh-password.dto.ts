import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class StartRefreshPasswordDTO {
  @IsEmail()
  email: string;
  @IsString()
  @MinLength(4)
  @MaxLength(4)
  verification_code: string;
}
