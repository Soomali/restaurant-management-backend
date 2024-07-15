import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-custom';

@Injectable()
export class EmailMatchStrategy extends PassportStrategy(
  Strategy,
  'email-match',
) {
  async validate(req: any) {
    if (req.body.email != req.user.email) {
      throw new UnauthorizedException('Emails do not match');
    }

    return req.user;
  }
}
