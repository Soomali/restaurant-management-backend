import { Injectable, PipeTransform } from '@nestjs/common';
import { mongoIdTransform } from '../mongo-id.transform.util';

@Injectable()
export class MongoIdTransformPipe implements PipeTransform {
  transform(value: any): any {
    if (typeof value == 'string') {
      return mongoIdTransform(value);
    }
    const obj = { ...value };
    const keys = Object.keys(obj);
    for (const key of keys) {
      if (Array.isArray(obj[key])) {
        obj[key] = obj[key].map(this.transform);
      } else if (obj[key] instanceof Object) {
        obj[key] = this.transform(obj[key]);
      } else {
        obj[key] = mongoIdTransform(obj[key]);
      }
    }

    return obj;
  }
}
