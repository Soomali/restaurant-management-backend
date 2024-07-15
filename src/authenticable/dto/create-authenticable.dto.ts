import {
  IsEmail,
  IsPhoneNumber,
  IsStrongPassword,
  MaxLength,
  MinLength,
  ValidateIf,
} from 'class-validator';

export class CreateAuthenticableDTO {
  @IsEmail()
  email: string;
  @IsStrongPassword()
  password: string;
  @IsPhoneNumber()
  phone_number: string;
  @MaxLength(4)
  @MinLength(4)
  @ValidateIf((obj, val) => val != null)
  verification_code?: string;
}
