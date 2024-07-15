
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ProductsController } from "./products.controller";
import { ProductsService } from "./products.service";
import { Products, ProductsSchema } from "./schema/products.schema";

@Module({
  controllers: [ProductsController],
  imports: [
    MongooseModule.forFeature([{ name: Products.name, schema: ProductsSchema }])
  ],
  providers: [ProductsService],
  exports: [ProductsService]
})
export class ProductsModule { }
    
    