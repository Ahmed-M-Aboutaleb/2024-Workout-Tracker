import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/users.entity';
import { Model, Types } from 'mongoose';
import { IUser } from './interfaces/users.interface';
import { IUsersFilters } from './interfaces/usersFilter.interface';
import * as argon from 'argon2';
import {
  IPagination,
  PaginatedResource,
} from 'src/helpers/decorators/pagination/interfaces/pagination.interface';
import { Sorting } from 'src/helpers/decorators/sortingParams/interfaces/sorting.interface';
import { getOrder } from 'src/helpers/getOrder';
import { getWhere } from 'src/helpers/getWhere';
import { Filtering } from 'src/helpers/decorators/filteringParms/interfaces/filtering.interface';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto): Promise<IUser> {
    const createdUser = new this.userModel(createUserDto);
    createdUser._id = new Types.ObjectId();
    createdUser.passwordHash = await this.hashPassword(createUserDto.password);
    const savedUser = await createdUser.save();
    return savedUser;
  }

  async findAll(
    { size, offset }: IPagination,
    sort?: Sorting,
    filter?: Filtering,
  ): Promise<PaginatedResource<Partial<IUser>>> {
    const order = await getOrder(sort);
    const where = await getWhere(filter);
    const users = await this.userModel
      .find(where)
      .sort(order)
      .skip(offset)
      .limit(size)
      .exec();
    return {
      totalItems: users.length,
      items: users,
      page: 1,
      size: users.length,
    };
  }

  async findOne(filters?: IUsersFilters): Promise<IUser> {
    const user = await this.userModel.findOne(filters).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async update(
    id: Types.ObjectId,
    updateUserDto: UpdateUserDto,
  ): Promise<IUser> {
    const user = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  async delete(id: Types.ObjectId): Promise<IUser> {
    const user = await this.userModel.findByIdAndDelete(id).exec();
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  private async hashPassword(password: string): Promise<string> {
    return await argon.hash(password);
  }
}
