import {
  Resolver,
  Query,
  Args,
  Mutation,
  ResolveField,
  Parent,
  Subscription,
} from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { AuthCredentials } from './dto/auth-credentials.dto';
import { UsePipes, ValidationPipe, Inject, forwardRef } from '@nestjs/common';
import { User } from './model/user.model';
import { JwtToken } from 'src/graphql';
import { TaskService } from 'src/task/task.service';
import { PubSub } from 'graphql-subscriptions';

const pubsub = new PubSub();
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

  @Query('user')
  user(@Args('name') name) {
    return this.authService.getUserByName(name);
  }

  @ResolveField()
  async tasks(@Parent() user) {
    const tasks = await this.taskService.getAllTasks(user);
    return tasks;
  }

  @Query()
  users() {
    return this.authService.getAllUsers();
  }

  @Mutation()
  @UsePipes(ValidationPipe)
  async signUp(@Args('signUpForm') signUpForm: AuthCredentials): Promise<User> {
    const newUser = await this.authService.signUp(signUpForm);
    pubsub.publish('userSignedUp', {
      userSignedUp: newUser,
    });
    return newUser;
  }

  @Subscription('userSignedUp', {
    filter: (payload, variables, context) => {
      /* console.log('payload: ', payload);
      console.log('variables: ', variables);
      console.log('context: ', context); */
      return true;
    },
  })
  messageCreated() {
    return pubsub.asyncIterator('userSignedUp');
  }
}
