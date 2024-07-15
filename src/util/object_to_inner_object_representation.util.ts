export function objectToInnerObjectRepresentation(upperObjectName: string, object: any): any {
  const keys = Object.keys(object);
  let obj = {};
  for (let key of keys) {
    obj[upperObjectName + '.' + key] = object[key];
  }
  return obj;
}