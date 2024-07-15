import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';
import { CreateAuthenticableDTO } from './dto/create-authenticable.dto';
import { InjectModel } from '@nestjs/mongoose';
import {
  Authenticable,
  AuthenticableDocument,
  AuthorizationLevel,
} from './schema/authenticable.schema';
import mongoose, { Model } from 'mongoose';
import { UpdateAuthenticableDTO } from './dto/update-authenticable.dto';
import * as bcrypt from 'bcrypt';
import { AuthenticableConstants } from './constants';
import { generate4digitRandomNumber } from 'src/util/generate_4_digit_random_number.util';
import { MailerService } from '@nestjs-modules/mailer';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';

@Injectable()
export class AuthenticableService implements OnModuleInit {
  constructor(
    @InjectModel(Authenticable.name)
    private authenticableModel: SoftDeleteModel<AuthenticableDocument>,

  ) {}
  async create(createAuthenticableDTO: CreateAuthenticableDTO) {
    createAuthenticableDTO.verification_code = await this.sendVerificationCode(
      createAuthenticableDTO.email,
    );
    const doc = await this.authenticableModel.create(createAuthenticableDTO);
    return doc;
  }
  async find(email?: string, phone_number?: string) {
    if (email != null) {
      return await this.authenticableModel.findOne({ email });
    } else if (phone_number != null) {
      return await this.authenticableModel.findOne({ phone_number });
    }
    return null;
  }

  async startPasswordRefresh(
    email: string,
    verification_code: string,
    password_refresh_token: string,
  ) {
    return await this.authenticableModel.findOneAndUpdate(
      {
        $and: [{ email }, { verification_code }],
      },
      {
        $set: { password_refresh_token },
      },
    );
  }

  async setAuthorizationLevel(
    email: string,
    authorizationLevel: AuthorizationLevel,
  ) {
    await this.authenticableModel.findOneAndUpdate(
      { email },
      { authorization_level: authorizationLevel },
    );
  }
  async verify(verification_code: string, email: string) {
    const authenticable = await this.authenticableModel.findOneAndUpdate(
      {
        verification_code,
        email,
      },
      {
        $unset: {
          verification_code: 1,
        },
      },
    );
    if (!authenticable) {
      throw new BadRequestException('Invalid verification code');
    }
    authenticable.is_verified = true;
    await authenticable.save();
    return authenticable.refresh_tokens[0];
  }
  async deleteById(_id: string) {
    await this.authenticableModel.deleteOne({ _id });
  }
  async delete(email: string, password: string) {
    await this.authenticableModel.deleteOne({ email, password });
  }
  async refreshToken(id: string, oldToken?: string, newToken?: string) {
    await this.authenticableModel.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(id),
        refresh_tokens: { $in: oldToken },
      },
      {
        $pull: { refresh_tokens: oldToken },
      },
    );
    await this.authenticableModel.findByIdAndUpdate(id, {
      $push: { refresh_tokens: newToken },

      $unset: { password_refresh_token: 1 },
    });
  }
  async update(id: string, updateAuthenticableDTO: UpdateAuthenticableDTO) {
    await this.authenticableModel.findByIdAndUpdate(id, updateAuthenticableDTO);
  }
  async findWithJwtToken(email: string, token: string) {
    return await this.authenticableModel.findOne({
      email,
      refresh_tokens: { $in: token },
    });
  }
  async refreshPasswordRequest(email: string) {
    const authenticable = await this.authenticableModel.findOne({
      email,
      is_verified: true,
    });
    if (!authenticable) {
      throw new BadRequestException('email not found');
    }
    const code = await this.sendVerificationCode(authenticable.email);
    authenticable.verification_code = code;
    await authenticable.save();
  }
  async sendVerificationCode(email: string) {
    const code = generate4digitRandomNumber();
    //TODO send verification code via sms.
    return code;
  }
  async addRefreshToken(email: string, token: string) {
    await this.authenticableModel.findOneAndUpdate(
      { email },
      {
        $addToSet: {
          refresh_tokens: token,
        },
      },
    );
  }
  async refreshPassword(
    email: string,
    password: string,
    verification_code: string,
  ) {
    const authenticable = await this.authenticableModel.findOneAndUpdate(
      {
        email,
        verification_code: verification_code,
        is_verified: true,
      },
      {
        $set: {
          password: await bcrypt.hash(
            password,
            AuthenticableConstants.genSalts,
          ),
          refresh_tokens: [],
        },
        $unset: {
          verification_code: 1,
        },
      },
    );
    if (!authenticable) {
      throw new ForbiddenException('codes do not match');
    }
    return authenticable;
  }
  async findOne(email: string, password: string) {
    const authenticable = await this.authenticableModel.findOne({
      email,
    });
    if (!authenticable) {
      return null;
    }
    if (await bcrypt.compare(password, authenticable.password)) {
      return authenticable;
    }
    return null;
  }

  async onModuleInit() {
    try {
      const res = await this.authenticableModel.find({authorization_level:AuthorizationLevel.super_admin}); // this method returns user data exist in database (if any)
      // checks if any user data exist
      if (res.length == 0) {
        await this.authenticableModel.create({
          "authorization_level": AuthorizationLevel.super_admin,
          "email": "superadmin@admin.com",
          "password": "12345678Aa.",
          "phone_number": "+905428428571",
        })  
      }
    } catch (error) {
      throw error;
    }
  }
}
