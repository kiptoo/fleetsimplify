import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { AuthStrategy } from '../auth.strategy';
import {PostComment,CommentSchema } from '../schemas/comment.schema';
import {Post,PostSchema } from '../schemas/post.schema';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
@Module({
  controllers: [CommentsController],
  providers: [CommentsService,AuthStrategy],
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env','.env.development.local', '.env.development'],
      isGlobal: true,
    }), 
    MongooseModule.forFeature([{ name: PostComment.name, schema: CommentSchema }]),
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: '10m',
      },
    }),
  
  ],
})
export class CommentsModule {}
