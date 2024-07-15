import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Observable } from 'rxjs';
import { Admin } from 'src/admin/schema/admin.schema';
import { AuthorizationLevel } from 'src/authenticable/schema/authenticable.schema';

@Injectable()
export class AdminIdMatchGuard implements CanActivate {
  constructor(@InjectModel(Admin.name) private readonly adminModel) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {

    const request = context.switchToHttp().getRequest();
    if(request.user.authorization_level == AuthorizationLevel.super_admin){
      return true;
    }
    return this.matchIds(request);
  }

  private async matchIds(request:any){
    const params = request.params;
    const result = await this.adminModel.findById(params.id ?? request.body.id);
    if(result.length == 0){
        throw new ForbiddenException();
    }
    return true;
  }

}
