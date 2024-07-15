import { IsNumber, IsString } from "class-validator";
import { ValidateIfNotNull } from "src/util/validate-if-not-null.porperty.decorator";

export class CreateProductsDto {
    
    @ValidateIfNotNull()
    can_be_ordered_with_zero_amount:boolean;
    @IsNumber()
    @ValidateIfNotNull()
    amount: number;
    @IsString()
    name:string;
    @IsString()
    description:string;
    @IsNumber()
    price: number;
    @IsString()
    photo:string;
}
    