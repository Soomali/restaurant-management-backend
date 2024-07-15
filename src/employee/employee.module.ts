
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { EmployeeController } from "./employee.controller";
import { EmployeeService } from "./employee.service";
import { Employee, EmployeeSchema } from "./schema/employee.schema";

@Module({
  controllers: [EmployeeController],
  imports: [
    MongooseModule.forFeature([{ name: Employee.name, schema: EmployeeSchema }])
  ],
  providers: [EmployeeService],
})
export class EmployeeModule { }
    
    