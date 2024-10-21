import { Test, TestingModule } from '@nestjs/testing';
import { ProfilesController } from './profiles.controller';
import { ProfilesService } from './profiles.service';
import { MongooseModule } from '@nestjs/mongoose';
import { rootMongooseTestModule } from '../../test/utils/db-connection';
import { Profile, ProfileSchema } from './entities/profile.entity';
import { IProfile } from './interfaces/profiles.interface';
import { CreateProfileDto } from './dto/create-profile.dto';
import { Filtering } from '../helpers/decorators/filteringParms/interfaces/filtering.interface';
import { Types } from 'mongoose';
import { UpdateProfileDto } from './dto/update-profile.dto';

describe('ProfilesController', () => {
  let controller: ProfilesController;
  let firstCreatedProfile: IProfile;

  const firstCreateProfileDto: CreateProfileDto = {
      firstName: 'Jane',
      lastName: 'Doe',
      bio: 'I am a software developer',
      userId: new Types.ObjectId(),
    },
    secondCreateProfileDto = {
      ...firstCreateProfileDto,
      firstName: 'John',
      userId: new Types.ObjectId(),
    };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        MongooseModule.forFeature([
          { name: Profile.name, schema: ProfileSchema },
        ]),
      ],
      controllers: [ProfilesController],
      providers: [ProfilesService],
    }).compile();

    controller = module.get<ProfilesController>(ProfilesController);
    firstCreatedProfile = await controller.create(firstCreateProfileDto);
    await controller.create(secondCreateProfileDto);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('CRUD operations', () => {
    it('should create a profile', async () => {
      expect(firstCreatedProfile).toBeDefined();
      expect(firstCreatedProfile).toHaveProperty('_id');
      expect(firstCreatedProfile).toHaveProperty(
        'firstName',
        firstCreateProfileDto.firstName,
      );
    });

    it('should find all profiles', async () => {
      const page = 1,
        size = 10,
        offset = (page - 1) * size;
      const profiles = await controller.findAll({ page, size, offset });
      expect(profiles).toBeDefined();
      expect(profiles.items).toHaveLength(2);
    });

    it('should find all profiles with filter', async () => {
      const page = 1,
        size = 10,
        offset = (page - 1) * size,
        filtering: Filtering = {
          property: 'firstName',
          value: firstCreateProfileDto.firstName,
          rule: 'eq',
        };
      const profiles = await controller.findAll(
        {
          page,
          size,
          offset,
        },
        undefined,
        filtering,
      );
      expect(profiles).toBeDefined();
      expect(profiles.items).toHaveLength(1);
    });

    it('should find a profile by id', async () => {
      const profile = await controller.findOne(firstCreatedProfile.userId);
      expect(profile).toBeDefined();
      expect(profile.firstName).toEqual(firstCreateProfileDto.firstName);
    });

    it('should update a profile', async () => {
      const updateProfileDto: UpdateProfileDto = {
        ...firstCreateProfileDto,
        firstName: 'Janet',
        createdAt: firstCreatedProfile.createdAt,
      };
      const id: string = firstCreatedProfile._id as unknown as string;
      const updatedProfile = await controller.update(id, updateProfileDto);
      expect(updatedProfile).toBeDefined();
      expect(updatedProfile.firstName).toEqual('Janet');
    });

    it('should remove a profile', async () => {
      const id: string = firstCreatedProfile._id as unknown as string;
      const removedProfile = await controller.remove(id);
      expect(removedProfile).toBeDefined();
      expect(removedProfile._id).toEqual(firstCreatedProfile._id);
    });
  });
});
