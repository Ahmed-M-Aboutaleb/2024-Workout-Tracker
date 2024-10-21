import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { IsUserExistsRule } from '../helpers/rules/IsUserExists.rule';
import { JwtService } from '@nestjs/jwt';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from 'test/utils/db-connection';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './entities/users.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { IUser } from './interfaces/users.interface';
import { Filtering } from '../helpers/decorators/filteringParms/interfaces/filtering.interface';
import { Types } from 'mongoose';

describe('UsersService', () => {
  let service: UsersService;
  let firstCreatedUser, secondCreateUser: IUser;
  const firstCreateUserDto: CreateUserDto = {
      username: 'iifire',
      password: 'P@ssw0rd',
    },
    secondCreateUserDto: CreateUserDto = {
      ...firstCreateUserDto,
      username: 'iifire2',
    };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
      ],
      providers: [IsUserExistsRule, UsersService, JwtService],
    }).compile();

    service = module.get<UsersService>(UsersService);
    firstCreatedUser = await service.create(firstCreateUserDto);
    secondCreateUser = await service.create(secondCreateUserDto);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('CRUD operations', () => {
    it('should create a user', async () => {
      expect(firstCreatedUser).toHaveProperty(
        'username',
        firstCreateUserDto.username,
      );
      expect(secondCreateUser).toHaveProperty(
        'username',
        secondCreateUserDto.username,
      );
    });

    it('should find all users', async () => {
      const page = 1,
        size = 10,
        offset = (page - 1) * size;
      const users = await service.findAll({ size, offset });
      expect(users.size).toBe(2);
    });

    it('should find all users with pagination', async () => {
      const page = 2,
        size = 10,
        offset = (page - 1) * size;
      const users = await service.findAll({ size, offset });
      expect(users.size).toBe(0);
    });

    it('should find all users with sorting', async () => {
      const page = 1,
        size = 10,
        offset = (page - 1) * size;
      const sort = { property: 'username', direction: 'desc' };
      const users = await service.findAll({ size, offset }, sort);
      expect(users.items).toBeInstanceOf(Array);
      expect(users.items).toHaveLength(2);
      expect(users.items[0]).toHaveProperty(
        'username',
        secondCreateUser.username,
      );
    });

    it('should find all users with filtering', async () => {
      const page = 1,
        size = 10,
        offset = (page - 1) * size;
      const filter: Filtering = {
        property: 'username',
        rule: 'eq',
        value: 'iifire',
      };
      const users = await service.findAll({ size, offset }, undefined, filter);
      expect(users.items).toBeInstanceOf(Array);
      expect(users.items).toHaveLength(1);
      expect(users.items[0]).toHaveProperty(
        'username',
        firstCreateUserDto.username,
      );
    });

    it('should find a user', async () => {
      const user = await service.findOne(firstCreatedUser._id);
      expect(user).toHaveProperty('username', firstCreateUserDto.username);
    });

    it('should find a user by username', async () => {
      const user = await service.findOne({
        username: firstCreatedUser.username,
      });
      expect(user).toHaveProperty('username', firstCreateUserDto.username);
    });

    it('should update a user', async () => {
      const updateUserDto: UpdateUserDto = {
        username: 'newUsername',
        createdAt: firstCreatedUser.createdAt,
      };
      const updatedUser = await service.update(
        firstCreatedUser._id,
        updateUserDto,
      );
      expect(updatedUser).toHaveProperty('username', 'newUsername');
    });

    it('should delete a user', async () => {
      const deletedUser = await service.delete(firstCreatedUser._id);
      expect(deletedUser).toHaveProperty(
        'username',
        firstCreateUserDto.username,
      );
    });
  });

  it('should throw an error when user not found', async () => {
    await expect(
      service.findOne({ _id: new Types.ObjectId('5f5f3e9f6f6f6f6f6f6f6f6f') }),
    ).rejects.toThrow('User not found');
  });

  it('should throw an error when user not found by username', async () => {
    await expect(
      service.findOne({ username: 'notExistingUsername' }),
    ).rejects.toThrow('User not found');
  });

  it('should throw an error when creating a user with an existing username', async () => {
    await expect(service.create(firstCreateUserDto)).rejects;
  });

  afterEach(async () => {
    await closeInMongodConnection();
  });
});
