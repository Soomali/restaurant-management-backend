
    import { Injectable } from "@nestjs/common";
import { CreateProductsDto } from "./dto/create-products.dto";
import { UpdateProductsDto } from "./dto/update-products.dto";
import { InjectModel } from "@nestjs/mongoose";
import {Products, ProductsDocument} from "./schema/products.schema";
import mongoose, { Model } from "mongoose";

import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { SoftDeleteModel } from "soft-delete-plugin-mongoose";

@Injectable()
export class ProductsService {

  constructor(@InjectModel(Products.name) private readonly productsModel: SoftDeleteModel<ProductsDocument>) { }

  create(createProductsDto: CreateProductsDto) {
    const { photo} = createProductsDto;

    // Decode base64 string to binary data
    const matches = photo.match(/^data:image\/([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      throw new Error('Invalid base64 image format');
    }
    if (!fs.existsSync(path.join(__dirname, '../../../', 'uploads'))) {
      fs.mkdirSync(path.join(__dirname, '../../../', 'uploads'), { recursive: true });
    }
    const buffer = Buffer.from(matches[2], 'base64');
    const fileExtension = matches[1].split('/').pop();
    const productId = new mongoose.Types.ObjectId();
    const fileName = `${productId}.${fileExtension}`;

    const filePath = path.join(__dirname, '../../../', 'uploads', fileName);
    // Save the image to a file
    fs.writeFileSync(filePath, buffer);
    return this.productsModel.create({...createProductsDto,_id:productId,photo_url:'http://localhost:3100/uploads/' + fileName});
  }

  findAll() {
    return this.productsModel.find({});
  }

  findOne(id: string) {
    return this.productsModel.findById(id);
  }

  async update(id: string, updateProductsDto: UpdateProductsDto) {
    await this.productsModel.findByIdAndUpdate(id, updateProductsDto);
    return this.productsModel.findById(id);
  }

  remove(id: string) {
    return this.productsModel.softDelete({_id:id});
  }
} 
    