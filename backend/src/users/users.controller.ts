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
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Types } from 'mongoose';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PaginationParams } from 'src/helpers/decorators/pagination/paginationParams';
import {
  IPagination,
  PaginatedResource,
} from 'src/helpers/decorators/pagination/interfaces/pagination.interface';
import { IUser } from './interfaces/users.interface';
import { SortingParams } from 'src/helpers/decorators/sortingParams/sortingParams';
import { Sorting } from 'src/helpers/decorators/sortingParams/interfaces/sorting.interface';
import { Filtering } from 'src/helpers/decorators/filteringParms/interfaces/filtering.interface';
import { FilteringParams } from 'src/helpers/decorators/filteringParms/filteringParms';
import { User } from './entities/users.entity';
import { JwtAuthGuard } from 'src/helpers/guards/jwt.guard';
import { RolesGuard } from 'src/helpers/guards/roles.guard';
import { Role } from 'src/helpers/decorators/roles/roles.decorator';
import { Roles } from 'src/helpers/decorators/roles/roles.enum';

@ApiTags('Users')
@ApiBearerAuth()
@Controller({ path: 'users', version: '1' })
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role(Roles.ADMIN)
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created.',
    type: User,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role(Roles.ADMIN)
  @ApiOperation({
    summary: 'Get all users with pagination, sorting, and filtering',
  })
  @ApiResponse({
    status: 200,
    description: 'Retrieve a paginated list of users',
    schema: {
      type: 'object',
      properties: {
        totalItems: { type: 'number' },
        items: { type: 'array', items: { $ref: '#/components/schemas/User' } },
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
    example: 'username:asc',
  })
  @ApiQuery({
    name: 'filter',
    type: [String],
    required: false,
    description: 'Fields to filter by',
    example: 'username:eq:admin',
  })
  async findAll(
    @PaginationParams() paginationParams: IPagination,
    @SortingParams(['username']) sort?: Sorting,
    @FilteringParams(['username', '_id', 'role']) filter?: Filtering,
  ): Promise<PaginatedResource<Partial<IUser>>> {
    return await this.usersService.findAll(paginationParams, sort, filter);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role(Roles.ADMIN)
  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiResponse({
    status: 200,
    description: 'Retrieve a user by ID',
    type: User,
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiQuery({
    name: 'id',
    type: String,
    description: 'User ID',
    required: true,
  })
  async findOne(@Param('id') id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid ID');
    }
    const objectId = new Types.ObjectId(id);
    return await this.usersService.findOne({ _id: objectId });
  }

  @Get('/username/:username')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role(Roles.ADMIN)
  @ApiOperation({ summary: 'Get a user by username' })
  @ApiResponse({
    status: 200,
    description: 'Retrieve a user by username',
    type: User,
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiQuery({
    name: 'username',
    type: String,
    description: 'Username',
    required: true,
  })
  async findOneByUsername(@Param('username') username: string) {
    return await this.usersService.findOne({ username });
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role(Roles.ADMIN)
  @ApiOperation({ summary: 'Update a user by ID' })
  @ApiResponse({
    status: 200,
    description: 'User has been successfully updated',
    type: User,
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiQuery({
    name: 'id',
    type: String,
    description: 'User ID',
    required: true,
  })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid ID');
    }
    const objectId = new Types.ObjectId(id);
    return await this.usersService.update(objectId, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role(Roles.ADMIN)
  @ApiOperation({ summary: 'Delete a user by ID' })
  @ApiResponse({
    status: 200,
    description: 'User has been successfully deleted',
    type: User,
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiQuery({
    name: 'id',
    type: String,
    description: 'User ID',
    required: true,
  })
  async delete(@Param('id') id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid ID');
    }
    const objectId = new Types.ObjectId(id);
    return await this.usersService.delete(objectId);
  }
}
