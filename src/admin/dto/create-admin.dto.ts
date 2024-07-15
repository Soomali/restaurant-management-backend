import { IsNotEmpty, IsNumber, IsMongoId } from "class-validator";
import mongoose from "mongoose";

export class CreateAdminDto {

    @IsNotEmpty()
    name:string;
    @IsNotEmpty()
    surname:string;
    @IsNumber()
    age:number;
    @IsMongoId()
    authenticable_id:string;
}
    