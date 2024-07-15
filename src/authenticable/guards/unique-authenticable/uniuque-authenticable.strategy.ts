import { ForbiddenException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-custom';
import { AuthenticableService } from 'src/authenticable/authenticable.service';

@Injectable()
export class UniqueAuthenticableStrategy extends PassportStrategy(
  Strategy,
  'unique-authenticable',
) {
  constructor(private authenticableService: AuthenticableService) {
    super();
  }
  async validate(req: any) {
    const authenticable = await this.authenticableService.find(req.body.email);
    if (authenticable && authenticable.is_verified) {
      throw new ForbiddenException('E-mail already is in use');
    }
    return true;
  }
}
