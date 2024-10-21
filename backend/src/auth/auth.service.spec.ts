import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { rootMongooseTestModule } from 'test/utils/db-connection';
import { UsersModule } from 'src/users/users.module';
import { ProfilesModule } from 'src/profiles/profiles.module';
import { JwtModule } from '@nestjs/jwt';
import { SignUpDto } from './dto/signUp.dto';
import { IAuthResponse } from './interfaces/authResponse.interface';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { SignInDto } from './dto/signIn.dto';

describe('AuthService', () => {
  let service: AuthService;
  const ENV = process.env.NODE_ENV;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: !ENV ? '.env' : `.env.${ENV}`,
        }),
        UsersModule,
        ProfilesModule,
        JwtModule.registerAsync({
          imports: [ConfigModule],
          global: true,
          useFactory: async (configService: ConfigService) => {
            const jwtSecret = await configService.get<string>('JWT_SECRET');
            return {
              secret: jwtSecret,
              global: true,
              signOptions: { expiresIn: '1h' },
            };
          },
          inject: [ConfigService],
        }),
        PassportModule.register({ defaultStrategy: 'jwt' }),
      ],
      providers: [AuthService],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should sign up a user', async () => {
    const signUpDto: SignUpDto = {
      username: 'testuser',
      password: 'password',
      firstName: 'Test',
      lastName: 'User',
    };
    const user: IAuthResponse = await service.signUp(signUpDto);
    expect(user).toBeDefined();
    expect(user.profile.firstName).toBe(signUpDto.firstName);
  });

  it('should sign in a user', async () => {
    const signInDto: SignInDto = {
      username: 'testuser',
      password: 'password',
    };
    const signUpDto: SignUpDto = {
      username: 'testuser',
      password: 'password',
      firstName: 'Test',
      lastName: 'User',
    };
    await service.signUp(signUpDto);
    const user: IAuthResponse = await service.signIn(signInDto);
    expect(user).toBeDefined();
    expect(user.profile.firstName).toBe('Test');
  });
});
