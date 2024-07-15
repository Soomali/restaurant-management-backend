
import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import {OrderService} from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { UpdateOrderProductDto } from './dto/update-order-product.dto';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.create(createOrderDto);
  }

  @Get()
  findAll() {
    return this.orderService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(id);
  }

  @Get('table/:id')
  findByTableId(@Param('id') id:string){
    return this.orderService.findByTableId(id);
  }
  @Patch("remove/:id/product/:productId")
  removeOrderProduct(@Param('id') id:string,@Param('productId') productId:string){
    return this.orderService.removeProductFromOrder(id,productId);
  }
  @Patch(':id/product/')
  updateOrderProduct(@Param('id') id:string, @Body() body: UpdateOrderProductDto) {
    return this.orderService.updateOrderProduct(id,body);
  }

  @Patch('complete/:id/product')
  completeProductsOrder(@Param('id') id:string,@Body() body: UpdateOrderProductDto[]){
    return this.orderService.completeOrderProduct(id,body);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.update(id, updateOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderService.remove(id);
  }
}   
    