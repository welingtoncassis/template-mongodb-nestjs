import {
  Document,
  FilterQuery,
  Model,
  PopulateOptions,
  Types,
  UpdateQuery,
} from 'mongoose';
import { InternalServerErrorException } from '@nestjs/common';
import { MongoError } from 'mongodb';

import { QueryDto } from '../../common/dtos/query.dto';

export abstract class BaseService<T extends Document> {
  public populate: PopulateOptions[] = [];
  protected constructor(private model: Model<T>) {}

  protected static throwMongoError(err: MongoError): void {
    throw new InternalServerErrorException(err, err.errmsg);
  }

  protected static toObjectId(id: string): Types.ObjectId {
    try {
      return Types.ObjectId(id);
    } catch (e) {
      this.throwMongoError(e);
    }
  }

  createModel(doc?: Partial<T>): T {
    return new this.model(doc);
  }

  async findAll(query?: QueryDto): Promise<T[]> {
    const filter = (query?.filter || {}) as FilterQuery<T>;
    const find = this.model.find(filter, query?.fields || {});

    if (query?.sort) {
      find.sort(query.sort);
    }

    if (query?.skip) {
      find.skip(query.skip);
    }

    if (query?.limit) {
      find.limit(query.limit);
    }
    return find.populate(this.populate);
  }

  async findOne(filter = {}): Promise<T> {
    return this.model.findOne(filter).populate(this.populate);
  }

  async findById(id: string): Promise<T> {
    return this.model
      .findById(BaseService.toObjectId(id))
      .populate(this.populate);
  }

  async create(item: Partial<T>): Promise<T> {
    try {
      return this.model.populate(await this.model.create(item), this.populate);
    } catch (e) {
      BaseService.throwMongoError(e);
    }
  }

  async delete(filter = {}): Promise<any> {
    return this.model.deleteMany(filter);
  }

  async deleteById(id: string): Promise<any> {
    return this.model.deleteOne({
      _id: BaseService.toObjectId(id),
    } as FilterQuery<T>);
  }

  async update(
    id: string | null,
    item: UpdateQuery<T>,
    upsert = true,
  ): Promise<T> {
    return this.model
      .findByIdAndUpdate(BaseService.toObjectId(id), item, {
        new: true,
        upsert: upsert,
      })
      .populate(this.populate);
  }

  // Keep same signature as mogoose updateMany
  async updateMany(filter, doc, options?, callback?): Promise<any> {
    return this.model.updateMany(filter, doc, options, callback);
  }

  async count(filter = {}): Promise<number> {
    return this.model.countDocuments(filter);
  }
}
