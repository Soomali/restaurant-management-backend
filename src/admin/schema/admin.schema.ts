
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { softDeletePlugin } from 'soft-delete-plugin-mongoose';
import { Authenticable } from 'src/authenticable/schema/authenticable.schema';
export type AdminDocument = HydratedDocument<Admin>;


@Schema()
export class Admin {
  
    @Prop({})
    name:string;
    @Prop({})
    surname:string;
    @Prop({})
    age:number;
    @Prop({required:true,ref:Authenticable.name})
    authenticable_id:mongoose.Types.ObjectId;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);

AdminSchema.plugin(softDeletePlugin);
    