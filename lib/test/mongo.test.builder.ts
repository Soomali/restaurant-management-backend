import { Connection, Model } from 'mongoose';
import { MongoTestModelPayload } from './mongo-test-model.payload';
import {
  connect,
  createMemoryServerForTesting,
} from 'src/util/test/db-handler.util';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Test, TestingModule } from '@nestjs/testing';
import { ModuleMetadata } from '@nestjs/common';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { writeFileSync, readFileSync } from 'fs';

const _testEnvFilePath = '.env';

export class MongoDbTestBuilder {
  private models: Model<any>[];
  private server: MongoMemoryServer;
  private connection: Connection;
  app: TestingModule | null;

  constructor(private modelPayloads: MongoTestModelPayload[]) { }
  addModel(payload: MongoTestModelPayload) {
    this.modelPayloads.push(payload);
  }
  private getModelPayload(name: string): MongoTestModelPayload | null {
    for (const model of this.modelPayloads) {
      if (model.name == name) {
        return model;
      }
    }
  }
  getModel(name: string): Model<any> | null {
    for (const model of this.models) {
      if (model.modelName == name) {
        return model;
      }
    }
  }
  async createConnection(port?: number) {
    this.server = await createMemoryServerForTesting(port);
    const mongo = await connect(this.server);
    this.connection = mongo.connection;
    const uri = this.server.getUri();

  }



  async disconnect() {
    await this.connection.dropDatabase();
    await this.connection.close();
    await this.server.stop();

  }

  async cleanDatabase() {
    const collections = this.connection.collections;
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
  }


  private configureModels(): any[] {
    const modelPayloads = this.modelPayloads.map((e) => {
      const model = this.connection.model(e.name, e.schema);
      return { provide: getModelToken(e.name), useValue: model };
    });
    this.models = modelPayloads.map((e) => e.useValue);
    return modelPayloads;
  }
  async configureTestModule(metaData: ModuleMetadata) {
    metaData.providers = metaData.providers
      ? [
        ...this.configureModels(),
        ...metaData.providers,
        // MongooseModule.forFeature(),
      ]
      : this.configureModels();

    this.app = await Test.createTestingModule(metaData).compile();
  }

  async addAllMockData(): Promise<void> {
    await Promise.all(
      this.modelPayloads.map((e) => this.addMockDataOf(e.name)),
    );
  }
  async addMockDataOf(name: string): Promise<void> {
    const model = this.getModel(name);
    const payload = this.getModelPayload(name);
    if (!model || !payload) {

      return;
    }
    if (!payload.mockDatas) {

      return;
    }
    let mockDatas = [];
    if (payload.transform) {
      for (let data of payload.mockDatas) {
        mockDatas.push(await payload.transform(data));
      }
    } else {
      mockDatas = payload.mockDatas;
    }
    await model.create(mockDatas);
  }
}
