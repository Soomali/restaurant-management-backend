
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { softDeletePlugin } from 'soft-delete-plugin-mongoose';

export type ProductsDocument = HydratedDocument<Products>;


@Schema()
export class Products {
    
    @Prop({default:true})
    avaliable:boolean;
    @Prop({default:false})
    can_be_ordered_with_zero_amount:boolean;
    @Prop({default: 0})
    amount: number;
    @Prop({required:true})
    name:string;
    @Prop({required:true})
    description:string;
    @Prop({required:true})
    price: number;
    @Prop({})
    photo_url:string;
}

export const ProductsSchema = SchemaFactory.createForClass(Products);


ProductsSchema.plugin(softDeletePlugin);