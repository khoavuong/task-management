import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { AuthCredentials } from './dto/auth-credentials.dto';
import { UsePipes, ValidationPipe } from '@nestjs/common';
import { User } from './model/user.model';
import { JwtToken } from 'src/graphql';

@Resolver('Auth')
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation()
  @UsePipes(ValidationPipe)
  signIn(@Args('signInForm') signInForm: AuthCredentials): Promise<JwtToken> {
    return this.authService.signIn(signInForm);
  }

  @Mutation()
  @UsePipes(ValidationPipe)
  signUp(@Args('signUpForm') signUpForm: AuthCredentials): Promise<User> {
    return this.authService.signUp(signUpForm);
  }
}
