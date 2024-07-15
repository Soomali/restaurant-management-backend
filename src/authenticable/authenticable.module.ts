import { Module } from '@nestjs/common';
import { AuthenticableService } from './authenticable.service';
import * as bcrypt from 'bcrypt';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Authenticable,
  AuthenticableSchema,
} from './schema/authenticable.schema';
import { AuthenticableConstants } from './constants';
import { UniqueAuthenticableStrategy } from './guards/unique-authenticable/uniuque-authenticable.strategy';
import { CodeVerifyStrategy } from './guards/code-verify/code-verify.strategy';
import { HttpModule, HttpService } from '@nestjs/axios';

@Module({
  providers: [
    AuthenticableService,
    UniqueAuthenticableStrategy,
    CodeVerifyStrategy,
  ],
  imports: [
    HttpModule.register({}),
    MongooseModule.forFeatureAsync([
      {
        name: Authenticable.name,
        useFactory: async () => {
          const schema = AuthenticableSchema;
          schema.pre('save', async function (next) {
            try {
              // eslint-disable-next-line @typescript-eslint/no-this-alias
              const authenticable = this;
              if (authenticable.isModified('password')) {
                this['password'] = await bcrypt.hash(
                  authenticable.password,
                  AuthenticableConstants.genSalts,
                );
              }
              return next();
            } catch (err) {
              next(err);
            }
          });
          return schema;
        },
      },
    ]),
  ],
  exports: [AuthenticableService, UniqueAuthenticableStrategy],
})
export class AuthenticableModule { }
