import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { getModelToken } from '@nestjs/mongoose';
import { Authenticable } from 'src/authenticable/schema/authenticable.schema';
import { JwtService } from '@nestjs/jwt';
import { AuthenticableService } from 'src/authenticable/authenticable.service';
import { MailerModule, MailerService } from '@nestjs-modules/mailer';
import { AppModule } from 'src/app.module';
import { AppointablesService } from 'src/appointables/appointables.service';
import { Appointable } from 'src/appointables/schema/appointable.schema';
import { CustomerService } from 'src/customer/customer.service';
import { CompanyService } from 'src/company/company.service';
import { Customer } from 'src/customer/schema/customer.schema';
import { Company } from 'src/company/schema/company.schema';

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        CustomerService,
        CompanyService,
        { provide: getModelToken(Authenticable.name), useValue: Authenticable },
        { provide: getModelToken(Appointable.name), useValue: Appointable },
        { provide: getModelToken(Customer.name), useValue: Customer },
        { provide: getModelToken(Company.name), useValue: Company },

        JwtService,
        AppointablesService,
        AuthenticableService,
      ],
      imports: [
        MailerModule.forRoot({
          transport:
            'smtps://info@randebul.com:Randebul123456MOBAX^2GoDaddy@smtpout.secureserver.net',
        }),
      ],
      controllers: [AuthController],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
