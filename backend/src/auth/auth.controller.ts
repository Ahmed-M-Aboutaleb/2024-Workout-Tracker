import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signIn.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SignUpDto } from './dto/signUp.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @ApiOperation({ summary: 'Sign in' })
  @ApiResponse({
    status: 200,
    description: 'User has been successfully signed in',
  })
  @ApiResponse({ status: 400, description: 'Invalid credentials' })
  @Post('signin')
  async signIn(@Body() signInDto: SignInDto) {
    return await this.authService.signIn(signInDto);
  }

  @ApiOperation({ summary: 'Sign up' })
  @ApiResponse({
    status: 201,
    description: 'User has been successfully signed up',
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @Post('signup')
  async signUp(@Body() signUpDto: SignUpDto) {
    return await this.authService.signUp(signUpDto);
  }
}
