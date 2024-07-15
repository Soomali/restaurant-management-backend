import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class EmailMatchAuthGuard extends AuthGuard('email-match') {}
