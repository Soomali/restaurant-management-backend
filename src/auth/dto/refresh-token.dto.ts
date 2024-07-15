import { IsJWT, IsNotEmpty, IsString } from 'class-validator';

export class RefreshTokenDTO {
  @IsNotEmpty()
  @IsString()
  @IsJWT()
  refresh_token: string;
}
