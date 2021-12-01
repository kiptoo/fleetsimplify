import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {User,UserDocument } from '../schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
@Injectable()
export class UsersService {

  constructor(
    @InjectModel(User.name) private readonly model: Model<UserDocument>,
  ) {}
  
  async create(createUserDto: CreateUserDto): Promise<User> {
    // return 'This action adds a new user';
    console.log("createUserDto",createUserDto)
    return await new this.model({
      ...createUserDto,
      createdAt: new Date(),
    }).save();
  }
  async login(cred: {username:string,password:string}): Promise<any> {
  
    // return await new this.model({
    //   ...CreateUserDto,
    //   createdAt: new Date(),
    // }).save();

    return Promise.resolve('logged in');
  }

  async  findAll() : Promise<User[]>{
    return await this.model.find().exec();
    // return `This action returns all users`;
  }

  async  findOne(id: number) :Promise<User>{
    // return `This action returns a #${id} user`;
    return await this.model.findById(id).exec();
  }

  async update(id: number, updateUserDto: UpdateUserDto) : Promise<User>{
    // return `This action updates a #${id} user`;
    return await this.model.findByIdAndUpdate(id, updateUserDto).exec();
 
  }

  async remove(id: number) :Promise<any> {
    // return `This action removes a #${id} user`;
    return await this.model.findByIdAndDelete(id).exec();
  }
}
