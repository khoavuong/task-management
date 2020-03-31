import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentials } from './dto/auth-credentials.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  @UsePipes(ValidationPipe)
  signUp(@Body() signUpForm: AuthCredentials) {
    return this.authService.signUp(signUpForm);
  }

  @Post('/signin')
  @UsePipes(ValidationPipe)
  signIn(@Body() signInForm: AuthCredentials) {
    return this.authService.signIn(signInForm);
  }
}
