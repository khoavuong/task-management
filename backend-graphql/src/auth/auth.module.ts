import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './model/user.model';
import { JwtModule } from '@nestjs/jwt';
import { AuthResolver } from './auth.resolver';
import { TaskModule } from 'src/task/task.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'users', schema: UserSchema }]),
    JwtModule.register({
      secret: 'khoa',
      signOptions: {
        noTimestamp: true,
      },
    }),
    forwardRef(() => TaskModule),
  ],
  providers: [AuthService, AuthResolver],
  exports: [AuthService],
})
export class AuthModule {}
