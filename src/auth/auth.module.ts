import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalStrategy } from './guards/local/local.strategy';
import { AuthenticableModule } from 'src/authenticable/authenticable.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './guards/jwt/jwt.strategy';
import { AuthController } from './auth.controller';
import { EmailMatchStrategy } from './guards/email-match/email-match.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminService } from 'src/admin/admin.service';
import { EmployeeService } from 'src/employee/employee.service';
import { Admin, AdminSchema } from 'src/admin/schema/admin.schema';
import { Employee, EmployeeSchema } from 'src/employee/schema/employee.schema';

@Module({
  providers: [
    AuthService,
    LocalStrategy,
    AdminService,
    EmployeeService,
    JwtStrategy,
    EmailMatchStrategy,

  ],
  imports: [
    ConfigModule.forRoot(),
    AuthenticableModule,
    PassportModule,
    MongooseModule.forFeature([
      {
        name: Admin.name,
        schema: AdminSchema,
      },
      {
        name: Employee.name,
        schema: EmployeeSchema,
      },
    ]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get('JWT_SECRET'),
        signOptions: { expiresIn: '7d' },
      }),
    }),
  ],
  exports: [AuthService, EmailMatchStrategy],
  controllers: [AuthController],
})
export class AuthModule { }
