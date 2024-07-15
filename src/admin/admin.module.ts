
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { AdminController } from "./admin.controller";
import { AdminService } from "./admin.service";
import { Admin, AdminSchema } from "./schema/admin.schema";
import { AuthenticableModule } from "src/authenticable/authenticable.module";

@Module({
  controllers: [AdminController],
  imports: [
    AuthenticableModule,
    MongooseModule.forFeature([{ name: Admin.name, schema: AdminSchema }])
  ],
  providers: [AdminService],
})
export class AdminModule { }
    
    