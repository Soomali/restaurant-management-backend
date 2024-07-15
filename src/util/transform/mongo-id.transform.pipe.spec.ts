import mongoose from 'mongoose';
import { MongoIdTransformPipe } from './mongo-id-transform.pipe';

describe('Mongo ID Transform Pipe', () => {
  const pipe = new MongoIdTransformPipe();
  it('Should convert mongoIds correctly', () => {
    const obj = {
      year: 2023,
      month: 10,
      day: 15,
      hour: 12,
      minute: 30,
      employee_id: '64c13a6280b703a3b7b46c80',
      company_id: '64aecfcdf025e4f7317503b1',
      service_id: '64c13a8a17d94a0677abbd2b',
      customer_id: '64c139929177dc25483d1542',
      price: 125,
      status: 0,
      _id: '64c13cfda81886bfd4249d86',
      __v: 0,
    };
    const expectedObject = {
      year: 2023,
      month: 10,
      day: 15,
      hour: 12,
      minute: 30,
      employee_id: new mongoose.Types.ObjectId('64c13a6280b703a3b7b46c80'),
      company_id: new mongoose.Types.ObjectId('64aecfcdf025e4f7317503b1'),
      service_id: new mongoose.Types.ObjectId('64c13a8a17d94a0677abbd2b'),
      customer_id: new mongoose.Types.ObjectId('64c139929177dc25483d1542'),
      price: 125,
      status: 0,
      _id: new mongoose.Types.ObjectId('64c13cfda81886bfd4249d86'),
      __v: 0,
    };
    const transfomObj = pipe.transform(obj);
    expect(transfomObj).toEqual(expectedObject);
  });
  it('Should convert nested mongoIds correctly', () => {
    const obj = {
      year: 2023,
      month: 10,
      day: 15,
      hour: 12,
      minute: 30,
      employee: { _id: '64c13a6280b703a3b7b46c80', name: 'Ahmet' },
      company_id: '64aecfcdf025e4f7317503b1',
      service_id: '64c13a8a17d94a0677abbd2b',
      customer_id: '64c139929177dc25483d1542',
      price: 125,
      status: 0,
      _id: '64c13cfda81886bfd4249d86',
      __v: 0,
    };
    const expectedObject = {
      year: 2023,
      month: 10,
      day: 15,
      hour: 12,
      minute: 30,

      employee: {
        _id: new mongoose.Types.ObjectId('64c13a6280b703a3b7b46c80'),
        name: 'Ahmet',
      },
      company_id: new mongoose.Types.ObjectId('64aecfcdf025e4f7317503b1'),
      service_id: new mongoose.Types.ObjectId('64c13a8a17d94a0677abbd2b'),
      customer_id: new mongoose.Types.ObjectId('64c139929177dc25483d1542'),
      price: 125,
      status: 0,
      _id: new mongoose.Types.ObjectId('64c13cfda81886bfd4249d86'),
      __v: 0,
    };
    const transfomObj = pipe.transform(obj);
    expect(transfomObj).toEqual(expectedObject);
  });

  it('Should convert nested mongoIds and arrays elements correctly', () => {
    const obj = {
      year: 2023,
      month: 10,
      day: 15,
      hour: 12,
      minute: 30,
      employee: {
        _id: '64c13a6280b703a3b7b46c80',
        name: 'Ahmet',
        services: [
          { _id: '64aecfcdf025e4f7317503b1' },
          { _id: '64c13a8a17d94a0677abbd2b' },
          { _id: '64c139929177dc25483d1542' },
        ],
      },
      company_id: '64aecfcdf025e4f7317503b1',
      service_id: '64c13a8a17d94a0677abbd2b',
      customer_id: '64c139929177dc25483d1542',
      price: 125,
      status: 0,
      _id: '64c13cfda81886bfd4249d86',
      __v: 0,
    };
    const expectedObject = {
      year: 2023,
      month: 10,
      day: 15,
      hour: 12,
      minute: 30,

      employee: {
        _id: new mongoose.Types.ObjectId('64c13a6280b703a3b7b46c80'),
        name: 'Ahmet',
        services: [
          { _id: new mongoose.Types.ObjectId('64aecfcdf025e4f7317503b1') },
          { _id: new mongoose.Types.ObjectId('64c13a8a17d94a0677abbd2b') },
          { _id: new mongoose.Types.ObjectId('64c139929177dc25483d1542') },
        ],
      },
      company_id: new mongoose.Types.ObjectId('64aecfcdf025e4f7317503b1'),
      service_id: new mongoose.Types.ObjectId('64c13a8a17d94a0677abbd2b'),
      customer_id: new mongoose.Types.ObjectId('64c139929177dc25483d1542'),
      price: 125,
      status: 0,
      _id: new mongoose.Types.ObjectId('64c13cfda81886bfd4249d86'),
      __v: 0,
    };
    const transfomObj = pipe.transform(obj);
    expect(transfomObj).toEqual(expectedObject);
  });
});
