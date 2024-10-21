import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ProfilesService } from 'src/profiles/profiles.service';
import { SignUpDto } from './dto/signUp.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { CreateProfileDto } from 'src/profiles/dto/create-profile.dto';
import { IProfile } from 'src/profiles/interfaces/profiles.interface';
import { IUser } from 'src/users/interfaces/users.interface';
import { TokenPayload } from './interfaces/tokenPayload.interface';
import { SignInDto } from './dto/signIn.dto';
import * as argon from 'argon2';
import { IAuthResponse } from './interfaces/authResponse.interface';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private profileService: ProfilesService,
  ) {}

  async signIn(signInDto: SignInDto): Promise<IAuthResponse> {
    try {
      const user: IUser = await this.usersService.findOne({
        username: signInDto.username,
      });
      if (!this.verifyPassword(signInDto.password, user.passwordHash)) {
        throw new BadRequestException('Invalid credentials');
      }
      const token = await this.createToken(user);
      const profile: IProfile = await this.profileService.findOne({
        userId: user._id,
      });
      return {
        access_token: token,
        profile: profile,
      };
    } catch (error) {
      throw error;
    }
  }

  async signUp(signUpDto: SignUpDto): Promise<IAuthResponse> {
    try {
      const user: IUser = await this.createUser(signUpDto);
      const profile: IProfile = await this.createProfile(signUpDto, user);
      const token = await this.createToken(user);
      return {
        access_token: token,
        profile: profile,
      };
    } catch (error) {
      throw error;
    }
  }

  private async createUser(signUpDto: SignUpDto) {
    const createUserDto: CreateUserDto = {
      username: signUpDto.username,
      password: signUpDto.password,
    };
    const user: IUser = await this.usersService.create(createUserDto);
    return user;
  }

  private async createProfile(signUpDto: SignUpDto, user: IUser) {
    const createProfileDto: CreateProfileDto = {
      firstName: signUpDto.firstName,
      lastName: signUpDto.lastName,
      bio: 'I have not written my bio yet',
      userId: user._id,
    };
    const profile: IProfile =
      await this.profileService.create(createProfileDto);
    return profile;
  }

  private async createToken(user: IUser) {
    const payload: TokenPayload = {
      username: user.username,
      userId: user._id,
      role: user.role,
    };
    return await this.jwtService.sign(payload);
  }

  private async verifyPassword(
    password: string,
    hash: string,
  ): Promise<boolean> {
    return await argon.verify(hash, password);
  }
}
