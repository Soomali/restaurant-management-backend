import { AuthorizationLevel } from 'src/authenticable/schema/authenticable.schema';


export class LoginResponse {
  authorization_level: AuthorizationLevel;
  _id: string;
  phone_number?: string;
  name?: string;
  surname?: string;
  email?: string;
}

