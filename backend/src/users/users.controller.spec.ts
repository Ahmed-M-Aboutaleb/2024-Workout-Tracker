import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { IsUserExistsRule } from '../helpers/rules/IsUserExists.rule';
import { rootMongooseTestModule } from '../../test/utils/db-connection';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './entities/users.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { IUser } from './interfaces/users.interface';
import { IPagination } from '../helpers/decorators/pagination/interfaces/pagination.interface';
import { Filtering } from '../helpers/decorators/filteringParms/interfaces/filtering.interface';

describe('UsersController', () => {
  let controller: UsersController;
  let firstCreatedUser: IUser;
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
      controllers: [UsersController],
      imports: [
        rootMongooseTestModule(),
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
      ],
      providers: [IsUserExistsRule, UsersService],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    firstCreatedUser = await controller.create(firstCreateUserDto);
    await controller.create(secondCreateUserDto);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('CRUD operations', () => {
    it('should create a user', async () => {
      expect(firstCreatedUser).toBeDefined();
      expect(firstCreatedUser).toHaveProperty('_id');
      expect(firstCreatedUser).toHaveProperty(
        'username',
        firstCreateUserDto.username,
      );
    });

    it('should find all users', async () => {
      const page = 1,
        size = 10,
        paginationParams: IPagination = {
          page: page,
          size: size,
          offset: (page - 1) * size,
        };
      const users = await controller.findAll(paginationParams);
      expect(users).toBeDefined();
    });

    it('should find all users with filter', async () => {
      const page = 1,
        size = 10,
        paginationParams: IPagination = {
          page: page,
          size: size,
          offset: (page - 1) * size,
        };
      const filter: Filtering = {
        property: 'username',
        value: firstCreateUserDto.username,
        rule: 'eq',
      };
      const users = await controller.findAll(
        paginationParams,
        undefined,
        filter,
      );
      expect(users).toBeDefined();
      expect(users.size).toBeGreaterThan(0);
    });

    it('should find a user by id', async () => {
      const id: string = firstCreatedUser._id as unknown as string;
      const user = await controller.findOne(id);
      expect(user).toBeDefined();
      expect(user).toHaveProperty('_id', firstCreatedUser._id);
    });

    it('should find a user by username', async () => {
      const user = await controller.findOneByUsername(
        firstCreateUserDto.username,
      );
      expect(user).toBeDefined();
      expect(user).toHaveProperty('_id', firstCreatedUser._id);
    });

    it('should update a user', async () => {
      const id: string = firstCreatedUser._id as unknown as string;
      const updatedUser = await controller.update(id, {
        username: 'iifire3',
        password: 'P@ssw0rd',
        createdAt: firstCreatedUser.createdAt,
      });
      expect(updatedUser).toBeDefined();
      expect(updatedUser).toHaveProperty('_id', firstCreatedUser._id);
      expect(updatedUser).toHaveProperty('username', 'iifire3');
    });

    it('should remove a user', async () => {
      const id: string = firstCreatedUser._id as unknown as string;
      const removedUser = await controller.delete(id);
      expect(removedUser).toBeDefined();
      expect(removedUser).toHaveProperty('_id', firstCreatedUser._id);
    });
  });
});
