import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './model/user.model';
import { AuthCredentials } from './dto/auth-credentials.dto';
import { JwtService } from '@nestjs/jwt';
import * as passwordHash from 'password-hash';
import { JwtToken } from 'src/graphql';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('users') private users: Model<User>,
    private jwtService: JwtService,
  ) {}

  async signUp(signUpForm: AuthCredentials): Promise<User> {
    if (await this.getUserByName(signUpForm.username))
      throw new ConflictException('Username already exists');

    const hashedPasswordForm = {
      ...signUpForm,
      password: passwordHash.generate(signUpForm.password),
    };
    const newUser = new this.users(hashedPasswordForm);
    return await newUser.save();
  }

  async signIn(signInForm: AuthCredentials): Promise<JwtToken> {
    const { username, password } = signInForm;
    const user = await this.users.findOne({ username });
    if (!user || !passwordHash.verify(password, user.password))
      throw new UnauthorizedException('Wrong username or password');

    const payload = { username };
    const accessToken = this.jwtService.sign(payload);
    return { accessToken };
  }

  async getUserByName(username: String): Promise<User> {
    const user = await this.users.findOne({ username });
    return user;
  }

  async getUserById(userId: String): Promise<User> {
    try {
      return await this.users.findById(userId);
    } catch (error) {
      throw new NotFoundException('User not found');
    }
  }
}
