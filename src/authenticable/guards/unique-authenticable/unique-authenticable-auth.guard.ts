import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class UniqueAuthenticableAuthGuard extends AuthGuard(
  'unique-authenticable',
) {}
