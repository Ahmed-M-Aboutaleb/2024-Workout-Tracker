import { Test, TestingModule } from '@nestjs/testing';
import { ProfilesService } from './profiles.service';
import { rootMongooseTestModule } from '../../test/utils/db-connection';
import { MongooseModule } from '@nestjs/mongoose';
import { Profile, ProfileSchema } from './entities/profile.entity';
import { IProfile } from './interfaces/profiles.interface';
import { CreateProfileDto } from './dto/create-profile.dto';
import { Filtering } from 'src/helpers/decorators/filteringParms/interfaces/filtering.interface';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Sorting } from 'src/helpers/decorators/sortingParams/interfaces/sorting.interface';
import { Types } from 'mongoose';

describe('ProfilesService', () => {
  let service: ProfilesService;
  let firstCreatedProfile, secondCreateProfile: IProfile;
  const firstCreateProfileDto: CreateProfileDto = {
      firstName: 'Jane',
      lastName: 'Doe',
      bio: 'I am John Doe',
      userId: new Types.ObjectId(),
      workoutsIds: ['60f7b3b4b5f7f3f7b3b4b5f7'],
      routinesIds: ['60f7b3b4b5f7f3f7b3b4b5f7'],
    },
    secondCreateProfileDto: CreateProfileDto = {
      ...firstCreateProfileDto,
      firstName: 'John',
    };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        MongooseModule.forFeature([
          { name: Profile.name, schema: ProfileSchema },
        ]),
      ],
      providers: [ProfilesService],
    }).compile();

    service = module.get<ProfilesService>(ProfilesService);
    firstCreatedProfile = await service.create(firstCreateProfileDto);
    secondCreateProfile = await service.create(secondCreateProfileDto);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('CRUD operations', () => {
    it('should create a profile', async () => {
      expect(firstCreatedProfile).toHaveProperty(
        'firstName',
        firstCreateProfileDto.firstName,
      );
      expect(secondCreateProfile).toHaveProperty(
        'firstName',
        secondCreateProfileDto.firstName,
      );
    });

    it('should find all profiles', async () => {
      const page = 1,
        size = 10,
        offset = (page - 1) * size,
        profiles = await service.findAll({ size, offset });
      expect(profiles.items).toHaveLength(2);
    });

    it('should find all profiles with pagination', async () => {
      const page = 2,
        size = 10,
        offset = (page - 1) * size,
        profiles = await service.findAll({ size, offset });
      expect(profiles.items).toHaveLength(0);
    });

    it('should find all profiles with sorting', async () => {
      const page = 1,
        size = 10,
        offset = (page - 1) * size,
        sort: Sorting = { property: 'firstName', direction: 'desc' },
        profiles = await service.findAll({ size, offset }, sort);
      expect(profiles.items).toBeInstanceOf(Array);
      expect(profiles.items).toHaveLength(2);
      expect(profiles.items[0]).toHaveProperty(
        'firstName',
        secondCreateProfile.firstName,
      );
    });

    it('should find all profiles with filtering', async () => {
      const page = 1,
        size = 10,
        offset = (page - 1) * size,
        filter: Filtering = {
          value: 'Jane',
          rule: 'eq',
          property: 'firstName',
        },
        profiles = await service.findAll({ size, offset }, undefined, filter);
      expect(profiles.items).toHaveLength(1);
      expect(profiles.items[0]).toHaveProperty('firstName', 'Jane');
    });

    it('should find one profile', async () => {
      const profile = await service.findOne({ firstName: 'Jane' });
      expect(profile).toHaveProperty('firstName', 'Jane');
    });

    it('should update a profile', async () => {
      const updateProfileDto: UpdateProfileDto = {
        ...firstCreateProfileDto,
        firstName: 'Johny',
        createdAt: firstCreatedProfile.createdAt,
      };
      const updatedProfile = await service.update(
        firstCreatedProfile._id,
        updateProfileDto,
      );
      expect(updatedProfile).toHaveProperty('firstName', 'Johny');
    });

    it('should delete a profile', async () => {
      const deletedProfile = await service.delete(firstCreatedProfile._id);
      expect(deletedProfile).toHaveProperty('firstName', 'Jane');
    });
  });
});
