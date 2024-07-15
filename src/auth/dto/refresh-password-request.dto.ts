import { IsEmail } from 'class-validator';

export class RefreshPasswordRequestDTO {
  @IsEmail()
  email: string;
}
