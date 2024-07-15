import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Observable } from 'rxjs';
import { Admin } from 'src/admin/schema/admin.schema';
import { AuthorizationLevel } from 'src/authenticable/schema/authenticable.schema';
import { Employee } from 'src/employee/schema/employee.schema';

@Injectable()
export class EmployeeIdMatchGuard implements CanActivate {
  constructor(@InjectModel(Employee.name) private readonly employeeModel) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {

    const request = context.switchToHttp().getRequest();
    if(request.user.authorization_level == AuthorizationLevel.super_admin
        || request.user.authorization_level == AuthorizationLevel.admin
        ){
      return true;
    }
    return this.matchIds(request);
  }

  private async matchIds(request:any){
    const params = request.params;
    const result = await this.employeeModel.findById(params.id ?? request.body.id);
    if(result.length == 0){
        throw new ForbiddenException();
    }
    return true;
  }

}
