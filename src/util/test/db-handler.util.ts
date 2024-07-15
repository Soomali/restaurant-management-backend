import { ModuleMetadata } from '@nestjs/common';
import { MongoDbTestBuilder } from 'lib/test/mongo.test.builder';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

export async function createMemoryServerForTesting(port?: number): Promise<MongoMemoryServer> {
  const instance: any = {
  }
  if (port) {
    instance.port = port;
  }
  const mongoServer = await MongoMemoryServer.create({
    instance
  });
  console.log('Created mongo server for testing.');
  return mongoServer;
}

export async function connect(
  server: MongoMemoryServer,
): Promise<typeof mongoose> {
  const uri = server.getUri();

  return await mongoose.connect(uri);
}

export async function connectBeforeTest(
  testBuilder: MongoDbTestBuilder,
  metaData: ModuleMetadata,
  port?: number
): Promise<void> {
  await testBuilder.createConnection(port);
  console.log('Created connection at test builder');
  await testBuilder.configureTestModule(metaData);
  await testBuilder.app.init();
  console.log('Configured test module in test builder.');
  await testBuilder.cleanDatabase();
  console.log('Cleaned the database');
}
