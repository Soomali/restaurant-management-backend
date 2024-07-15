
    import { Injectable, NotFoundException, OnModuleInit } from "@nestjs/common";
import { CreateAdminDto } from "./dto/create-admin.dto";
import { UpdateAdminDto } from "./dto/update-admin.dto";
import { InjectModel } from "@nestjs/mongoose";
import {Admin, AdminDocument} from "./schema/admin.schema";
import mongoose, { Model } from "mongoose";
import { SoftDeleteModel } from "soft-delete-plugin-mongoose";
import { Authenticable } from "src/authenticable/schema/authenticable.schema";
import { AuthenticableService } from "src/authenticable/authenticable.service";

@Injectable()
export class AdminService implements OnModuleInit {

  constructor(@InjectModel(Admin.name) private readonly adminModel: SoftDeleteModel<AdminDocument>
  , private readonly authenticableService: AuthenticableService
  ) { }

  create(createAdminDto: CreateAdminDto) {
    return this.adminModel.create(createAdminDto);
  }

  async onModuleInit() {
    try {
      const res = await this.adminModel.find({}); // this method returns user data exist in database (if any)
      // checks if any user data exist
      if (res.length == 0) {
        const authenticable = await this.authenticableService.find("superadmin@admin.com");
        await this.adminModel.create({
          "authenticable_id": authenticable._id,
          "name": "Superadmin",
          "surname": "Superadmin",
          "age": 99,
          
        })  
      }
    } catch (error) {
      throw error;
    }
  }
  findAll() {
    return this.adminModel.find({});
  }

  async findByAuthenticableId(id:string){
    const admins = await this.adminModel.find({authenticable_id:new mongoose.Types.ObjectId(id)});
    if(admins.length == 0){
      throw new NotFoundException();
    }
    return admins[0];
  }

  findOne(id: string) {
    return this.adminModel.findById(id);
  }

  update(id: string, updateAdminDto: UpdateAdminDto) {
    return this.adminModel.findByIdAndUpdate(id, updateAdminDto);
  }

  remove(id: string) {
    return this.adminModel.softDelete({_id:id});
  }
} 
    