import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users.service';
import { UserModelProvider } from './users-test.provider';
import * as bcrypt from 'bcrypt';

describe('UsersService', () => {
  let service: UsersService;

  const user: any = {
    _id: '613fb21477bb6d002c5170db',
    name: 'user01',
    email: 'user01@gmail.com.br',
    password: '$2b$10$mEwI8FepiSheMDIUHViDW.nRVk9M9cLciIvfmP/rPfoRqYM79g1W2',
    toObject: () => {
      return {
        _id: '613fb21477bb6d002c5170db',
        name: 'user01',
        email: 'user01@gmail.com.br',
      };
    },
    validatePassword: async (pwd: string) => {
      return bcrypt.compare(pwd, user.password);
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [UsersService, UserModelProvider(user)],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('validatePassowrd with correct inputs should null', async () => {
    const response = await service.validatePassowrd(user, '12345678');
    expect(response).toBeTruthy();
  });
});
