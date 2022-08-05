import { getModelToken } from '@nestjs/mongoose';
import { User } from '../users.schema';

const userModel = (model: any) => {
  return {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    findOne: () => {
      return {
        select: () => {
          return {
            exec: () => {
              return {
                _id: model._id,
                email: model.email,
                password: model.password,
                name: model.name,
                toObject: model.toObject,
                validatePassword: async (pwd: string) => {
                  return pwd === model.password;
                },
              };
            },
          };
        },
      };
    },
    findAll: () => [],
    findById: () => {
      return {
        populate: () => {
          return {
            _id: model._id,
            email: model.email,
            password: model.password,
            name: model.name,
            toObject: model.toObject,
            validatePassword: async (pwd: string) => {
              return pwd === model.password;
            },
          };
        },
      };
    },
    updateOne: () => {
      return {
        exec: () => [],
      };
    },
  };
};

export const UserModelProvider = (model: any) => {
  return {
    provide: getModelToken(User.name),
    useValue: userModel(model),
  };
};
