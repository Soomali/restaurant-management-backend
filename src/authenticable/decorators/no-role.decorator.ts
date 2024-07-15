import { SetMetadata } from '@nestjs/common';

export const IS_NO_ROLE = 'isNoRole';
export const NoRole = () => SetMetadata(IS_NO_ROLE, true);
