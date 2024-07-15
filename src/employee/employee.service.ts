
    import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateEmployeeDto } from "./dto/create-employee.dto";
import { UpdateEmployeeDto } from "./dto/update-employee.dto";
import { InjectModel } from "@nestjs/mongoose";
import {Employee, EmployeeDocument} from "./schema/employee.schema";
import mongoose, { Model } from "mongoose";
import { SoftDeleteModel } from "soft-delete-plugin-mongoose";

@Injectable()
export class EmployeeService {

  constructor(@InjectModel(Employee.name) private readonly employeeModel: SoftDeleteModel<EmployeeDocument>) { }

  create(createEmployeeDto: CreateEmployeeDto,) {
    return this.employeeModel.create(createEmployeeDto);
  }

  findAll() {
    return this.employeeModel.find({});
  }
  async findByAuthenticableId(id:string){
    const admins = await this.employeeModel.find({authenticable_id:new mongoose.Types.ObjectId(id)});
    if(admins.length == 0){
      throw new NotFoundException();
    }
    return admins[0];
  }

  findOne(id: string) {
    return this.employeeModel.findById(id);
  }

  update(id: string, updateEmployeeDto: UpdateEmployeeDto) {
    return this.employeeModel.findByIdAndUpdate(id, updateEmployeeDto);
  }

  remove(id: string) {
    return this.employeeModel.softDelete({_id:id});
  }
} 
    