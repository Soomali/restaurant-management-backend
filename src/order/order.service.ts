
    import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { CreateOrderDto } from "./dto/create-order.dto";
import { UpdateOrderDto } from "./dto/update-order.dto";
import { InjectModel } from "@nestjs/mongoose";
import {Order, OrderDocument, OrderProduct} from "./schema/order.schema";
import mongoose, { Model, mongo } from "mongoose";
import { SoftDeleteModel } from "soft-delete-plugin-mongoose";
import { UpdateOrderProductDto } from "./dto/update-order-product.dto";
import { ProductsService } from "src/products/products.service";
import { TableService } from "src/table/table.service";

@Injectable()
export class OrderService {

  constructor(
    private readonly productService:ProductsService,
    private readonly tableService:TableService,
    @InjectModel(Order.name) private readonly orderModel: SoftDeleteModel<OrderDocument>,
  ) { }

  async create(createOrderDto: CreateOrderDto) {
    const orders = await this.findByTableId(createOrderDto.table_id.toString());
    if(!orders || orders.length == 0){
      const table = await this.tableService.findOne(createOrderDto.table_id.toString());
      return this.orderModel.create({...createOrderDto,table_number: table.number});
    }
    const updateProducts = createOrderDto.products.map((e) => {
      return {
        product_id:e.product_id,
        amount: e.amount
      };
    });
    for(let product of updateProducts){
      await this.updateOrderProduct(orders[0]._id.toString(),product,true);
    }
    return (await this.findByTableId(createOrderDto.table_id.toString()))[0];

  }

  async findAll() {
    const deleted = await this.orderModel.findDeleted();
    const ongoing = await this.orderModel.find();
    return [...deleted,...ongoing];
  }

  findOne(id: string) {
    return this.orderModel.findById(id);
  }
  findByTableId(id:string){
    return this.orderModel.find({table_id:new mongoose.Types.ObjectId(id)});
  }


  async removeProductFromOrder(orderId:string,productId:string){
    const order = await this.orderModel.findById(orderId);
    const orderProduct = order.products.find((product) => product.product_id.equals(new mongoose.Types.ObjectId(productId)));
    const index = order.products.indexOf(orderProduct);
    order.products.splice(index,1);
    if(orderProduct.amount != 1){
      order.products.splice(index,0,{...orderProduct,amount: orderProduct.amount - 1});
    }
    await order.save();
    return order;
  }


  async updateOrderProduct(orderId:string,updateOrderProductDto: UpdateOrderProductDto,add:boolean = false){
    const order = await this.orderModel.findById(orderId);
    const orderProduct = order.products.find((product) => product.product_id.equals(updateOrderProductDto.product_id) );
    if(orderProduct == null){
      const product = await this.productService.findOne(updateOrderProductDto.product_id.toString());
      order.products.push({...JSON.parse(JSON.stringify(product.toJSON())), order_date: new Date(), product_id:updateOrderProductDto.product_id,amount:updateOrderProductDto.amount});
    }else if(updateOrderProductDto.amount <= 0){
      order.products.splice(order.products.indexOf(orderProduct),1);
    }else {
      if(!add){
        order.products[order.products.indexOf(orderProduct)].amount = updateOrderProductDto.amount;
        
      }else {

        const amount = updateOrderProductDto.amount + orderProduct.amount;
        order.products.splice(order.products.indexOf(orderProduct),1);
        order.products.push({...orderProduct,amount});

      }
    }
    await order.save();
    return order;
  }

  async completeOrderProduct(orderId:string,completedProducts: UpdateOrderProductDto[]){
    const order = await this.orderModel.findById(orderId);
    for(let completedProduct of Object.values(completedProducts)){
      const orderProduct = order.products.find((product) => product.product_id.equals(completedProduct.product_id) );
      if(orderProduct == null){
        continue;
      }
      const index = order.products.indexOf(orderProduct);
      if(completedProduct.amount > order.products[index].amount){
        throw new BadRequestException("can not pay more than ordered amount!");
      }
      order.products[index].amount -= completedProduct.amount;
      const updatedOrderProduct = order.products[index];
      order.products.splice(index,1); 
      if(updatedOrderProduct.amount > 0){
        order.products.push(updatedOrderProduct);
      } 
      const paidProduct = order.paid_products.find((item) => item.product_id.equals(completedProduct.product_id));
      if(!paidProduct){
        order.paid_products.push({...updatedOrderProduct,amount: completedProduct.amount});
      }else {
        const paidIndex = order.paid_products.indexOf(paidProduct);
        order.paid_products.splice(paidIndex,1);
        order.paid_products.splice(paidIndex,0,{...paidProduct,amount: paidProduct.amount + completedProduct.amount});
      }
    }
    await order.save();
    return order;
    
  }

  update(id: string, updateOrderDto: UpdateOrderDto) {
    return this.orderModel.findByIdAndUpdate(id, updateOrderDto);
  }

  remove(id: string) {
    return this.orderModel.softDelete({_id:id});
  }
} 
    