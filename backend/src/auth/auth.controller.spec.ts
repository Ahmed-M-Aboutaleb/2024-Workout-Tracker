import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from 'src/users/users.module';
import { ProfilesModule } from 'src/profiles/profiles.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { rootMongooseTestModule } from 'test/utils/db-connection';
import { SignUpDto } from './dto/signUp.dto';

describe('AuthController', () => {
  let controller: AuthController;
  const ENV = process.env.NODE_ENV;
  const signupDto: SignUpDto = {
    firstName: 'Test',
    lastName: 'User',
    username: 'test',
    password: 'P@ssW0rd',
  };
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
      controllers: [AuthController],
      providers: [AuthService],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should sign up', async () => {
    const result = await controller.signUp(signupDto);
    expect(result).toHaveProperty('access_token');
  });

  it('should sign in', async () => {
    await controller.signUp(signupDto);
    const result = await controller.signIn({
      username: signupDto.username,
      password: signupDto.password,
    });
    expect(result).toHaveProperty('access_token');
  });

  it('should not sign in with invalid credentials', async () => {
    await controller.signUp(signupDto);
    try {
      await controller.signIn({
        username: signupDto.username,
        password: 'invalid',
      });
    } catch (error) {
      expect(error.message).toBe('Invalid credentials');
    }
  });

  it('should not sign up with invalid input data', async () => {
    try {
      await controller.signUp({
        ...signupDto,
        password: 'invalid',
      });
    } catch (error) {
      expect(error.message).toBe('Invalid input data');
    }
  });
});
