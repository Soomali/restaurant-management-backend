
    import { Injectable } from "@nestjs/common";
import { CreateTableDto } from "./dto/create-table.dto";
import { UpdateTableDto } from "./dto/update-table.dto";
import { InjectModel } from "@nestjs/mongoose";
import {Table, TableDocument} from "./schema/table.schema";
import { Model } from "mongoose";
import { SoftDeleteModel } from "soft-delete-plugin-mongoose";

@Injectable()
export class TableService {

  constructor(@InjectModel(Table.name) private readonly tableModel: SoftDeleteModel<TableDocument>) { }

  create(createTableDto: CreateTableDto) {
    return this.tableModel.create(createTableDto);
  }

  findAll() {
    return this.tableModel.find({});
  }

  findOne(id: string) {
    return this.tableModel.findById(id);
  }

  update(id: string, updateTableDto: UpdateTableDto) {
    return this.tableModel.findByIdAndUpdate(id, updateTableDto);
  }

  remove(id: string) {
    return this.tableModel.softDelete({_id:id});
  }
} 
    