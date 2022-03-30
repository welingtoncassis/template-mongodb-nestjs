import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PopulateOptions, UpdateQuery } from 'mongoose';
import { QueryDto } from '../common/dtos/query.dto';
import { BaseService } from '../common/services/base.service';
import { User, UserDocument } from './users.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService extends BaseService<UserDocument> {
  public populate: PopulateOptions[] = [];
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {
    super(userModel);
  }
}
