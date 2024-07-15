import { SetMetadata } from '@nestjs/common';
import { AuthorizationLevel } from '../schema/authenticable.schema';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: AuthorizationLevel[]) =>
  SetMetadata(ROLES_KEY, roles);
