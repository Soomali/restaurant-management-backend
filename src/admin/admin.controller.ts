
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import {AdminService} from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { AdminIdMatchGuard } from 'src/util/guards/admin-id-match-guard/admin-id-match-guard';
import { Admin, AdminDocument } from './schema/admin.schema';
import { Model } from 'mongoose';
import { Roles } from 'src/authenticable/decorators/roles.decorator';
import { AuthorizationLevel } from 'src/authenticable/schema/authenticable.schema';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService,) {}
  @Roles(AuthorizationLevel.super_admin)
  @Post()
  create(@Body() createAdminDto: CreateAdminDto) {
    return this.adminService.create(createAdminDto);
  }
  @Roles(AuthorizationLevel.super_admin)
  @Get()
  findAll() {
    return this.adminService.findAll();
  }
  @Roles(AuthorizationLevel.super_admin)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adminService.findOne(id);
  }
  @UseGuards(AdminIdMatchGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAdminDto: UpdateAdminDto) {
    return this.adminService.update(id, updateAdminDto);
  }

  @UseGuards(AdminIdMatchGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.adminService.remove(id);
  }
}   
    