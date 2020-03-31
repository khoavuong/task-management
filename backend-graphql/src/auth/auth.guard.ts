import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { AuthService } from './auth.service';
import { UnauthorizedException } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext) {
    const req = context.getArgs()[2].req;
    const auth = req && req.headers.authorization;

    if (!auth || auth.split(' ')[0] !== 'Bearer')
      throw new UnauthorizedException('Wrong access token');

    const token = auth.split(' ')[1];
    try {
      const decode = jwt.verify(token, 'khoa');
      const user = await this.authService.getUserByName(decode['username']);
      if (!user) throw new UnauthorizedException('Wrong access token');

      const graphqlContext = GqlExecutionContext.create(context);
      graphqlContext.getArgs().req = {
        user: { _id: user._id, username: user.username },
      };

      return true;
    } catch (err) {
      throw new UnauthorizedException('Wrong access token');
    }
  }
}
