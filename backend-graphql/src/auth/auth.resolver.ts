import {
  Resolver,
  Query,
  Args,
  Mutation,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { AuthCredentials } from './dto/auth-credentials.dto';
import { UsePipes, ValidationPipe, Inject, forwardRef } from '@nestjs/common';
import { User } from './model/user.model';
import { JwtToken } from 'src/graphql';
import { TaskService } from 'src/task/task.service';

@Resolver('User')
export class AuthResolver {
  constructor(
    private authService: AuthService,
    private taskService: TaskService,
  ) {}

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

  @Query('user')
  user(@Args('name') name) {
    return this.authService.getUserByName(name);
  }

  @ResolveField()
  async tasks(@Parent() user) {
    const tasks = await this.taskService.getAllTasks(user);
    return tasks;
  }
}
