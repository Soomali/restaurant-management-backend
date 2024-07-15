import { IsMongoId, IsNumber } from "class-validator";
import mongoose from "mongoose";

export class UpdateOrderProductDto {

    @IsMongoId()
    product_id: mongoose.Types.ObjectId;
    @IsNumber()
    amount: number;
    
}