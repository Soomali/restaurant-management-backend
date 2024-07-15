import { BadRequestException } from '@nestjs/common';
import { Types } from 'mongoose';

export const mongoIdTransform = (value: any) => {
  if (
    Types.ObjectId.isValid(value) &&
    new Types.ObjectId(value).toString() === value
  ) {
    return new Types.ObjectId(value);
  }
  return value;
};
