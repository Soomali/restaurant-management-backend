import { PartialType } from '@nestjs/mapped-types';
import { CreateAuthenticableDTO } from './create-authenticable.dto';

export class UpdateAuthenticableDTO extends PartialType(
  CreateAuthenticableDTO,
) {}
