
import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import {TableService} from './table.service';
import { CreateTableDto } from './dto/create-table.dto';
import { UpdateTableDto } from './dto/update-table.dto';
import { Roles } from 'src/authenticable/decorators/roles.decorator';
import { AuthorizationLevel } from 'src/authenticable/schema/authenticable.schema';
import { NoRole } from 'src/authenticable/decorators/no-role.decorator';

@Roles(AuthorizationLevel.admin,AuthorizationLevel.super_admin)
@Controller('table')
export class TableController {
  constructor(private readonly tableService: TableService) {}
  @Post()
  create(@Body() createTableDto: CreateTableDto) {
    return this.tableService.create(createTableDto);
  }
  @NoRole()
  @Get()
  findAll() {
    return this.tableService.findAll();
  }

  @NoRole()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tableService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTableDto: UpdateTableDto) {
    return this.tableService.update(id, updateTableDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tableService.remove(id);
  }
}   
    