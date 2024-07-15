import { ValidateIf } from 'class-validator';

export function ValidateIfNotNull() {
  return ValidateIf((obj, val) => val != null);
}
