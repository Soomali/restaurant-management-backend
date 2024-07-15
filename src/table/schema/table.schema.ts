
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { softDeletePlugin } from 'soft-delete-plugin-mongoose';

export type TableDocument = HydratedDocument<Table>;

export enum TableStatus {
    occupied = 'occupied',
    empty = 'empty'
}

@Schema()
export class Table {
    @Prop({})
    number:number;
    @Prop({enum:TableStatus,default: TableStatus.empty})
    status: TableStatus;
  
}

export const TableSchema = SchemaFactory.createForClass(Table);

    
TableSchema.plugin(softDeletePlugin);