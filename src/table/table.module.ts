
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { TableController } from "./table.controller";
import { TableService } from "./table.service";
import { Table, TableSchema } from "./schema/table.schema";

@Module({
  controllers: [TableController],
  imports: [
    MongooseModule.forFeature([{ name: Table.name, schema: TableSchema }])
  ],
  providers: [TableService],
  exports:[TableService]
})
export class TableModule { }
    
    