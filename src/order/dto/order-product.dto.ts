import { IsMongoId, IsNumber, IsString } from "class-validator";
import mongoose from "mongoose";
export class OrderProductDto {
    @IsMongoId()
    product_id: mongoose.Types.ObjectId;
    @IsNumber()
    amount: number;
    @IsString()
    name:string;
    @IsString()
    description:string;
    @IsNumber()
    price: number;
    @IsString()
    photo_url:string;
    
}