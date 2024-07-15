
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { OrderController } from "./order.controller";
import { OrderService } from "./order.service";
import { Order, OrderSchema } from "./schema/order.schema";
import { ProductsModule } from "src/products/products.module";
import { ProductsService } from "src/products/products.service";
import { TableModule } from "src/table/table.module";

@Module({
  controllers: [OrderController],
  imports: [
    ProductsModule,
    TableModule,
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }])
  ],
  providers: [OrderService,],
})
export class OrderModule { }
    
    