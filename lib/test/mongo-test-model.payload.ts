export interface MongoTestModelPayload {
  name: string;
  schema: any;
  mockDatas?: any[];
  transform?: (data: any) => Promise<any>
}
