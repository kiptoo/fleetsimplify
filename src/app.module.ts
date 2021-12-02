import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthStrategy } from './auth.strategy';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { CommentsModule } from './comments/comments.module';

@Module({
  imports: [  ConfigModule.forRoot({
    envFilePath: ['.env','.env.development.local', '.env.development'],
    isGlobal: true,
  }), MongooseModule.forRoot(process.env.MONGODB_URL), UsersModule, PostsModule, CommentsModule],
  controllers: [AppController],
  providers: [AppService,AuthStrategy],
})
export class AppModule {}
