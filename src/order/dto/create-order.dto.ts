import { Type } from "class-transformer";
import { OrderProductDto } from "./order-product.dto";
import { ArrayNotEmpty, IsMongoId, ValidateNested } from "class-validator";
import mongoose from "mongoose";

export class CreateOrderDto {
    @ArrayNotEmpty()
    @ValidateNested({each:true})
    products: OrderProductDto[];
    @IsMongoId()
    table_id: mongoose.Types.ObjectId;

}
    