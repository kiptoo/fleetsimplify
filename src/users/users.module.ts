import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { AuthStrategy } from '../auth.strategy';
import { MongooseModule } from '@nestjs/mongoose';
import {User,UserSchema } from '../schemas/user.schema';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
@Module({
  controllers: [UsersController],
  providers: [UsersService,AuthStrategy],
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env','.env.development.local', '.env.development'],
      isGlobal: true,
    }), 
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: '10m',
      },
    }),
  ],
})
export class UsersModule {}
