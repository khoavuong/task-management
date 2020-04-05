import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { TaskModule } from './task/task.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    GraphQLModule.forRoot({
      typePaths: ['./**/*.graphql'],
      definitions: {
        path: join(process.cwd(), 'src/graphql.ts'),
        outputAs: 'class',
      },
      context: ({ req, connection }) => {
        if (connection) return connection.context;
        return { req };
      },
      installSubscriptionHandlers: true,
      /* subscriptions: {
        onConnect: async connectionParam => {
          return false;
        },
      }, */
    }),
    MongooseModule.forRoot('mongodb://localhost:27017/nest', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    }),
    TaskModule,
    AuthModule,
  ],
})
export class AppModule {}
