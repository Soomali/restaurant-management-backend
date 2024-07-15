import { IsJWT, IsStrongPassword } from 'class-validator';

export class RefreshPasswordDTO {
  @IsStrongPassword()
  password: string;
  @IsJWT()
  password_refresh_token: string;
}
