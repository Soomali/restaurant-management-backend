import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { softDeletePlugin } from 'soft-delete-plugin-mongoose';
import { generate4digitRandomNumber } from 'src/util/generate_4_digit_random_number.util';

export type AuthenticableDocument = HydratedDocument<Authenticable>;

export enum AuthorizationLevel {
  employee,
  admin,
  super_admin,
}

@Schema()
export class Authenticable {
  @Prop({
    required: true,
    unique: true,
  })
  email: string;
  @Prop({
    required: true,
  })
  password: string;
  @Prop({ required: true, unique: true })
  phone_number: string;
  @Prop({
    default: [],
  })
  refresh_tokens: string[];
  @Prop({
    default: generate4digitRandomNumber,
  })
  verification_code: string;
  @Prop({
    default: false,
  })
  is_verified: boolean;
  @Prop({
    default: AuthorizationLevel.employee,
  })
  authorization_level: AuthorizationLevel;
  @Prop({})
  password_refresh_token: string;
}

export const AuthenticableSchema = SchemaFactory.createForClass(Authenticable);
AuthenticableSchema.plugin(softDeletePlugin);