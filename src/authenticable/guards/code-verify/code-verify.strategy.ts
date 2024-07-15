import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-custom';
import { AuthenticableService } from 'src/authenticable/authenticable.service';

@Injectable()
export class CodeVerifyStrategy extends PassportStrategy(
  Strategy,
  'code-verify',
) {
  constructor(private authenticableService: AuthenticableService) {
    super();
  }
  async validate(req: any) {
    const token = await this.authenticableService.verify(
      req.body.verification_code,
      req.user.email,
    );
    req.access_token = token;

    return req.user;
  }
}
