import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { Profile } from './entities/profile.entity';
import { PaginationParams } from '../helpers/decorators/pagination/paginationParams';
import {
  IPagination,
  PaginatedResource,
} from '../helpers/decorators/pagination/interfaces/pagination.interface';
import { Sorting } from '../helpers/decorators/sortingParams/interfaces/sorting.interface';
import { SortingParams } from '../helpers/decorators/sortingParams/sortingParams';
import { FilteringParams } from '../helpers/decorators/filteringParms/filteringParms';
import { Filtering } from '../helpers/decorators/filteringParms/interfaces/filtering.interface';
import { IProfile } from './interfaces/profiles.interface';
import { Types } from 'mongoose';
import { Role } from 'src/helpers/decorators/roles/roles.decorator';
import { Roles } from 'src/helpers/decorators/roles/roles.enum';
import { JwtAuthGuard } from 'src/helpers/guards/jwt.guard';
import { RolesGuard } from 'src/helpers/guards/roles.guard';

@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role(Roles.ADMIN)
  @ApiOperation({ summary: 'Create a new profile' })
  @ApiResponse({
    status: 201,
    description: 'The profile has been successfully created.',
    type: Profile,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  async create(@Body() createProfileDto: CreateProfileDto) {
    return await this.profilesService.create(createProfileDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role(Roles.ADMIN)
  @ApiOperation({
    summary: 'Get all profiles with pagination, sorting, and filtering',
  })
  @ApiResponse({
    status: 200,
    description: 'Retrieve a paginated list of profiles',
    schema: {
      type: 'object',
      properties: {
        totalItems: { type: 'number' },
        items: {
          type: 'array',
          items: { $ref: '#/components/schemas/Profile' },
        },
        page: { type: 'number' },
        size: { type: 'number' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid query parameters' })
  @ApiQuery({
    name: 'page',
    type: Number,
    description: 'Page number for pagination',
    example: 1,
    required: true,
  })
  @ApiQuery({
    name: 'size',
    type: Number,
    description: 'Number of items per page',
    example: 10,
    required: true,
  })
  @ApiQuery({
    name: 'sort',
    type: [String],
    required: false,
    description: 'Fields to sort by',
    example: 'firstName:asc',
  })
  @ApiQuery({
    name: 'filter',
    type: [String],
    required: false,
    description: 'Fields to filter by',
    example: 'firstName:eq:Ahmed',
  })
  async findAll(
    @PaginationParams() paginationParams: IPagination,
    @SortingParams(['firstName', 'lastName', 'createdAt', 'updatedAt'])
    sort?: Sorting,
    @FilteringParams([
      '_id',
      'firstName',
      'lastName',
      'createdAt',
      'updatedAt',
      '_id',
    ])
    filter?: Filtering,
  ): Promise<PaginatedResource<Partial<IProfile>>> {
    return await this.profilesService.findAll(paginationParams, sort, filter);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role(Roles.ADMIN)
  @ApiOperation({ summary: 'Get a profile by id' })
  @ApiResponse({
    status: 200,
    description: 'The profile has been successfully retrieved.',
    type: Profile,
  })
  @ApiResponse({ status: 404, description: 'Profile not found' })
  @ApiQuery({
    name: 'id',
    type: String,
    description: "The unique identifier of the user's profile",
    required: true,
  })
  async findOne(@Param('id') id: string): Promise<IProfile> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid id');
    }
    return this.profilesService.findOne({ userId: new Types.ObjectId(id) });
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role(Roles.ADMIN)
  @ApiOperation({ summary: 'Update a profile by id' })
  @ApiResponse({
    status: 200,
    description: 'The profile has been successfully updated.',
    type: Profile,
  })
  @ApiResponse({ status: 404, description: 'Profile not found' })
  @ApiQuery({
    name: 'id',
    type: String,
    description: "The unique identifier of the user's profile",
    required: true,
  })
  async update(
    @Param('id') id: string,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid id');
    }
    return await this.profilesService.update(
      new Types.ObjectId(id),
      updateProfileDto,
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role(Roles.ADMIN)
  @ApiOperation({ summary: 'Delete a profile by id' })
  @ApiResponse({
    status: 200,
    description: 'The profile has been successfully deleted.',
    type: Profile,
  })
  @ApiResponse({ status: 404, description: 'Profile not found' })
  @ApiQuery({
    name: 'id',
    type: String,
    description: "The unique identifier of the user's profile",
    required: true,
  })
  async remove(@Param('id') id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid id');
    }
    return await this.profilesService.delete(new Types.ObjectId(id));
  }
}
