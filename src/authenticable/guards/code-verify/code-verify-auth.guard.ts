import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class CodeVerifyAuthGuard extends AuthGuard('code-verify') {}
