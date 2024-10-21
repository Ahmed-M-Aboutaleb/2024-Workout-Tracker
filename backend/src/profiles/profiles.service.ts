import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Profile } from './entities/profile.entity';
import { Model, Types } from 'mongoose';
import {
  IPagination,
  PaginatedResource,
} from '../helpers/decorators/pagination/interfaces/pagination.interface';
import { Sorting } from '../helpers/decorators/sortingParams/interfaces/sorting.interface';
import { Filtering } from '../helpers/decorators/filteringParms/interfaces/filtering.interface';
import { IProfile } from './interfaces/profiles.interface';
import { getOrder } from '../helpers/getOrder';
import { getWhere } from '../helpers/getWhere';
import { IProfilesFilters } from './interfaces/profilesFilters.interface';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectModel(Profile.name) private profileModel: Model<Profile>,
  ) {}
  async create(createProfileDto: CreateProfileDto) {
    const createdProfile = new this.profileModel(createProfileDto);
    const savedProfile = await createdProfile.save();
    return savedProfile;
  }

  async findAll(
    { size, offset }: IPagination,
    sort?: Sorting,
    filter?: Filtering,
  ): Promise<PaginatedResource<Partial<IProfile>>> {
    const order = await getOrder(sort);
    const where = await getWhere(filter);
    const profiles = await this.profileModel
      .find(where)
      .sort(order)
      .skip(offset)
      .limit(size)
      .exec();
    return {
      totalItems: profiles.length,
      items: profiles,
      page: 1,
      size: profiles.length,
    };
  }

  async findOne(filters?: IProfilesFilters): Promise<IProfile> {
    const profile = await this.profileModel.findOne(filters).exec();
    if (!profile) {
      throw new NotFoundException('Profile not found');
    }
    return profile;
  }

  async update(
    id: Types.ObjectId,
    updateProfileDto: UpdateProfileDto,
  ): Promise<IProfile> {
    const updatedProfile = await this.profileModel
      .findByIdAndUpdate(id, updateProfileDto, { new: true })
      .exec();
    if (!updatedProfile) {
      throw new NotFoundException('Profile not found');
    }
    return updatedProfile;
  }

  async delete(id: Types.ObjectId): Promise<IProfile> {
    const profile = await this.profileModel.findByIdAndDelete(id).exec();
    if (!profile) {
      throw new NotFoundException('Profile not found');
    }
    return profile;
  }
}
