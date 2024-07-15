import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthenticableService } from 'src/authenticable/authenticable.service';
import { JwtService } from '@nestjs/jwt';
import {
  AuthenticableDocument,
  AuthorizationLevel,
} from 'src/authenticable/schema/authenticable.schema';
import { CreateAuthenticableDTO } from 'src/authenticable/dto/create-authenticable.dto';
import { generate4digitRandomNumber } from 'src/util/generate_4_digit_random_number.util';
import { RefreshPasswordDTO } from './dto/refresh-password.dto';
import mongoose from 'mongoose';

@Injectable()
export class AuthService {
  constructor(
    private authenticableService: AuthenticableService,
    private jwtService: JwtService,
  ) {}
  async register(createAuthenticableDTO: CreateAuthenticableDTO) {
    const existing = await this.authenticableService.find(
      createAuthenticableDTO.email,
      createAuthenticableDTO.phone_number,
    );
    if (existing && existing.is_verified) {
      throw new ForbiddenException({ message: 'email is already in use' });
    }
    if (existing) {
      await this.authenticableService.update(existing._id.toString(), {
        ...createAuthenticableDTO,
        verification_code: generate4digitRandomNumber(),
      });
      return { access_token: existing.refresh_tokens[0], id: existing._id };
    }
    const authenticable = await this.authenticableService.create(
      createAuthenticableDTO,
    );
    const access_token = await this.jwtService.sign({
      email: authenticable.email,
      sub: authenticable._id,
    });
    authenticable.refresh_tokens.push(access_token);
    await authenticable.save();
    return { access_token, id: authenticable._id };
  }
  async verify(email: string, verification_code: string) {
    return await this.authenticableService.verify(verification_code, email);
  }
  async refreshToken(refreshToken: string) {
    try {
      const decoded = this.jwtService.decode(refreshToken) as TokenData;
      if (!decoded) {
        throw Error();
      }

      await this.jwtService.verify(refreshToken);

      const authenticable = await this.authenticableService.find(decoded.email);
      const { access_token } = await this.login({
        authenticable: authenticable,
      });

      await this.authenticableService.refreshToken(
        decoded.sub,
        refreshToken,
        access_token,
      );
      return { access_token };
    } catch (err) {
      throw new UnauthorizedException();
    }
  }
  async validateAuthenticable(email: string, password: string) {
    const authenticable = await this.authenticableService.findOne(
      email,
      password,
    );

    if (authenticable) {
      return authenticable;
    }
    return null;
  }
  async login({
    email,
    password,
    authenticable,
  }: {
    email?: string;
    password?: string;
    authenticable?: AuthenticableDocument;
  }) {
    if (!authenticable) {
      authenticable = await this.authenticableService.findOne(email, password);
    }
    const token = authenticable.refresh_tokens?.at(0);
    try {
      await this.jwtService.verify(token);
      return {
        access_token: token,
        authorization_level: authenticable.authorization_level,

        authenticable_id:authenticable._id,
      };
    } catch (e) {
      const payload = { email: authenticable.email, sub: authenticable._id };
      const newToken = this.jwtService.sign(payload);
      this.authenticableService.refreshToken(
        authenticable._id.toString(),
        token,
        newToken,
      );
      return {
        access_token: newToken,
        authorization_level: authenticable.authorization_level,
        authenticable_id:authenticable._id,
      };
    }
  }
  async requestRefreshPassword(email: string) {
    await this.authenticableService.refreshPasswordRequest(email);
  }
  async startRefreshPassword(email: string, verification_code: string) {
    const payload = { email: email, code: verification_code };
    const token = this.jwtService.sign(payload);
    const authenticable = await this.authenticableService.startPasswordRefresh(
      email,
      verification_code,
      token,
    );
    if (authenticable == null) {
      throw new ForbiddenException();
    }
    return { password_refresh_token: token };
  }

  async refreshPasswordConfirm(
    refreshPasswordDto: RefreshPasswordDTO,
  ): Promise<{
    access_token: string;
    authorization_level: AuthorizationLevel;
    email: string;
    _id: mongoose.Types.ObjectId;
  }> {
    const verificationTokenPayload = this.jwtService.decode(
      refreshPasswordDto.password_refresh_token,
    ) as { email: string; verification_code: string };
    const authenticable = await this.authenticableService.find(
      verificationTokenPayload.email,
    );
    if (
      authenticable.password_refresh_token !=
      refreshPasswordDto.password_refresh_token
    ) {
      throw new ForbiddenException();
    }
    authenticable.password = refreshPasswordDto.password;
    delete authenticable.password_refresh_token;
    const payload = { email: authenticable.email, sub: authenticable._id };
    const token = this.jwtService.sign(payload);
    this.authenticableService.refreshToken(
      authenticable._id.toString(),
      null,
      token,
    );
    return {
      access_token: token,
      email: authenticable.email,
      _id: authenticable._id,
      authorization_level: authenticable.authorization_level,
    };
  }
}
