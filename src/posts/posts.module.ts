import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { AuthStrategy } from '../auth.strategy';
import {Post,PostSchema } from '../schemas/post.schema';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import {User,UserSchema } from '../schemas/user.schema';
@Module({
  controllers: [PostsController],
  providers: [PostsService,AuthStrategy],
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env','.env.development.local', '.env.development'],
      isGlobal: true,
    }), 
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: '10m',
      },
    }),
  
  ],
})
export class PostsModule {}
