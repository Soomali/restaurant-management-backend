import { IsMongoId, IsNotEmpty, IsNumber } from "class-validator";
import mongoose from "mongoose";

export class CreateEmployeeDto {
    @IsNotEmpty()
    name:string;
    @IsNotEmpty()
    surname:string;
    @IsNumber()
    age:number;
    @IsMongoId()
    authenticable_id:string;
}
    