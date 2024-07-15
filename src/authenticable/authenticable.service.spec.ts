import { Test, TestingModule } from '@nestjs/testing';
import { AuthenticableService } from './authenticable.service';
import { JwtService } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';
import { Authenticable } from './schema/authenticable.schema';
import { MailerModule, MailerService } from '@nestjs-modules/mailer';

describe('AuthenticableService', () => {
  let service: AuthenticableService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthenticableService,
        JwtService,
        { provide: getModelToken(Authenticable.name), useValue: Authenticable },
      ],
      imports: [MailerModule.forRoot({
        transport: 'smtps://info@randebul.com:Randebul123456MOBAX^2GoDaddy@smtpout.secureserver.net',

      })]
    }).compile();

    service = module.get<AuthenticableService>(AuthenticableService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
