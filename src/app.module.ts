import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {ProductsModule} from './products/products.module'
import {OrderModule} from './order/order.module'
import {TableModule} from './table/table.module'
import {AdminModule} from './admin/admin.module'
import {EmployeeModule} from './employee/employee.module'
import { JwtAuthGuard } from './auth/guards/jwt/jwt-auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './authenticable/guards/role/role.guard';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { Authenticable, AuthenticableSchema } from './authenticable/schema/authenticable.schema';
import mongoose from 'mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

 @Module({
  imports: [ 
      EmployeeModule, 
      AdminModule, 
      TableModule, 
      OrderModule, 
      AuthModule,
      ServeStaticModule.forRoot({
        rootPath: join(__dirname, '../../', 'uploads'),
        serveRoot: '/uploads', // This is the prefix path for accessing files
      }),

      ConfigModule.forRoot({
        envFilePath: ['.env', '.docker.env'],
        cache: false,
        load: [],
      }),

      MongooseModule.forRootAsync({
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => {
          const uri = configService.get<string>('MONGODB_URL');
          return {
            uri,
          };
        },
        inject: [ConfigService],
      }),
    

      ProductsModule,],
  controllers: [AppController],
  providers: [AppService,  AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },],
})
export class AppModule {}
