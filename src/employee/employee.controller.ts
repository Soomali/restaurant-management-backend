
import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import {EmployeeService} from './employee.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { Roles } from 'src/authenticable/decorators/roles.decorator';
import { AuthorizationLevel } from 'src/authenticable/schema/authenticable.schema';

@Controller('employee')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}
  @Roles(AuthorizationLevel.super_admin,AuthorizationLevel.admin)
  @Post()
  create(@Body() createEmployeeDto: CreateEmployeeDto,) {
    return this.employeeService.create(createEmployeeDto,);
  }

  @Roles(AuthorizationLevel.super_admin,AuthorizationLevel.admin)
  @Get()
  findAll() {
    return this.employeeService.findAll();
  }

  @Roles(AuthorizationLevel.super_admin,AuthorizationLevel.admin)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.employeeService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEmployeeDto: UpdateEmployeeDto) {
    return this.employeeService.update(id, updateEmployeeDto);
  }

  @Roles(AuthorizationLevel.super_admin,AuthorizationLevel.admin)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.employeeService.remove(id);
  }
}   
    