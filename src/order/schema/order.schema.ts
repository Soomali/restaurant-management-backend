
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { softDeletePlugin } from 'soft-delete-plugin-mongoose';
import { Products } from 'src/products/schema/products.schema';
import { Table } from 'src/table/schema/table.schema';

export type OrderDocument = HydratedDocument<Order>;

@Schema()
export class OrderProduct {

    @Prop({required:true,ref:Products.name})
    product_id: mongoose.Types.ObjectId;
    @Prop({required:true})
    amount: number;
    @Prop({required:true})
    name:string;
    @Prop({required:true})
    description:string;
    @Prop({required:true})
    price: number;
    @Prop({})
    photo_url:string;
    @Prop({default: Date.now})
    order_date:Date;
}

@Schema()
export class Order {

    @Prop({required:true})
    products:OrderProduct[];
    @Prop({default:[]})
    paid_products:OrderProduct[];
    @Prop({ref:Table.name})
    table_id: mongoose.Types.ObjectId;
    @Prop({ref:Table.name})
    table_number: number;
    @Prop({default: Date.now})
    order_date:Date;
  
}

export const OrderSchema = SchemaFactory.createForClass(Order);

    
OrderSchema.plugin(softDeletePlugin);