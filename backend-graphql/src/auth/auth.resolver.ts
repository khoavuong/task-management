import { Resolver, Query, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { AuthCredentials } from './dto/auth-credentials.dto';
import { UsePipes, ValidationPipe } from '@nestjs/common';
import { User } from './model/user.model';
import { JwtToken } from 'src/graphql';

@Resolver('Auth')
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Query()
  @UsePipes(ValidationPipe)
  signIn(@Args('signInForm') signInForm: AuthCredentials): Promise<JwtToken> {
    return this.authService.signIn(signInForm);
  }

  @Query()
  @UsePipes(ValidationPipe)
  signUp(@Args('signUpForm') signUpForm: AuthCredentials): Promise<User> {
    return this.authService.signUp(signUpForm);
  }
}
