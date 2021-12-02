import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {User,UserDocument } from '../schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Mongoose } from 'mongoose';
// import { MongoError } from 'mongodb';
@Injectable()
export class UsersService {

  constructor(
    @InjectModel(User.name) private readonly model: Model<UserDocument>,
  ) {}
  
  async create(createUserDto: CreateUserDto): Promise<any> {
    // return 'This action adds a new user';
    console.log("createUserDto",createUserDto)
    try {
    return  new this.model({
      ...createUserDto,
      createdAt: new Date(),
    }).save()
  } catch (error) {

    console.log('error code',error.code)
    // console.log('error',error)
    if (error?.code === 11000) {
      throw new HttpException('User with that email already exists', HttpStatus.BAD_REQUEST);
    }
    throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
  }
  }
  async login(cred: {username:string,password:string}): Promise<any> {
  
    // return await new this.model({
    //   ...CreateUserDto,
    //   createdAt: new Date(),
    // }).save();

    let existUser = await this.model.findOne({ email: cred.username }).select("+password").populate('following').populate('followed_by').exec();
    if (!existUser){
    throw new HttpException('User with that email does not exists', HttpStatus.BAD_REQUEST);
     }

    const passwordCorrect = await existUser.comparePasswordMethod(cred.password);
    if (!passwordCorrect){
      throw new HttpException('invalid email or password', HttpStatus.BAD_REQUEST);

    }

  
    return existUser;

    // return Promise.resolve('logged in');
  }

  async  findAll() : Promise<User[]>{
    return await this.model.find().populate('following').populate('followed_by').exec();
    // return `This action returns all users`;
  }

  async  findOne(id: string) :Promise<User>{
    // return `This action returns a #${id} user`;
    return await this.model.findById(id).populate('following').populate('followed_by').exec();
  }

  async update(id: string, updateUserDto: UpdateUserDto) : Promise<User>{
    // return `This action updates a #${id} user`;
    return await this.model.findByIdAndUpdate(id, updateUserDto).exec();
 
  }
  async follow(id: string,updateUserDto: UpdateUserDto) {
  
    console.log("updatePostDto",updateUserDto)
    try {
    // return await new this.model({
    //   ...updateUserDto,
    //   update_date: new Date(),
    // }).save();
    let likeupdate =   this.model.findByIdAndUpdate({_id:id},{$addToSet:{'followed_by':updateUserDto._id}},{new : true})
    .then(async res=>{
       return await this.model.findByIdAndUpdate({_id:updateUserDto._id},{$addToSet:{'following':id}},{new : true}).exec() 
    })
    if(likeupdate){
      return likeupdate
    }
    else{
      throw new HttpException('Something went wrong,cannot like this post', HttpStatus.INTERNAL_SERVER_ERROR);
    }
   
  } catch (error) {

    console.log('error code',error.code)
    // console.log('error',error)
    // if (error?.code === 11000) {
    //   throw new HttpException('User with that email already exists', HttpStatus.BAD_REQUEST);
    // }
    throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
  }
  }
  async unfollow(id: string,updateUserDto: UpdateUserDto) {
  
    console.log("updatePostDto",updateUserDto)
    try {
    // return await new this.model({
    //   ...updateUserDto,
    //   update_date: new Date(),
    // }).save();
    let likeupdate =   this.model.findByIdAndUpdate({_id:id},{$pull:{'followed_by':updateUserDto._id}},{new : true})
    .then(async res=>{
       return await this.model.findByIdAndUpdate({_id:updateUserDto._id},{$pull:{'following':id}},{new : true}).exec() 
    })
    if(likeupdate){
      return  likeupdate
    }
    else{
      throw new HttpException('Something went wrong,cannot like this post', HttpStatus.INTERNAL_SERVER_ERROR);
    }
   
  } catch (error) {

    console.log('error code',error.code)
    // console.log('error',error)
    // if (error?.code === 11000) {
    //   throw new HttpException('User with that email already exists', HttpStatus.BAD_REQUEST);
    // }
    throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
  }
  }
  

  async remove(id: string) :Promise<any> {
    // return `This action removes a #${id} user`;
    return await this.model.findByIdAndDelete(id).exec();
  }
}
