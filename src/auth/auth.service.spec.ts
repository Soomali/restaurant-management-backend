import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { AuthenticableService } from 'src/authenticable/authenticable.service';
import { getModelToken } from '@nestjs/mongoose';
import { Authenticable } from 'src/authenticable/schema/authenticable.schema';
import { JwtService } from '@nestjs/jwt';
import { MailerModule, MailerService } from '@nestjs-modules/mailer';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        AuthenticableService,
        { provide: getModelToken(Authenticable.name), useValue: Authenticable },
        JwtService,
      ],
      imports: [
        MailerModule.forRoot({
          transport:
            'smtps://info@randebul.com:Randebul123456MOBAX^2GoDaddy@smtpout.secureserver.net',
        }),
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
