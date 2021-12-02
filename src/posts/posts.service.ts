import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post,PostDocument } from 'src/schemas/post.schema';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import {User,UserDocument } from '../schemas/user.schema';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private readonly model: Model<PostDocument>,
    @InjectModel(User.name) private readonly usermodel: Model<UserDocument>,
  ) {}
  async create(createPostDto: CreatePostDto) {
  
    console.log("createUserDto",createPostDto)
    try {
    return await new this.model({
      ...createPostDto,
      createdAt: new Date(),
    }).save();
  } catch (error) {

    console.log('error code',error.code)
    // console.log('error',error)
    // if (error?.code === 11000) {
    //   throw new HttpException('User with that email already exists', HttpStatus.BAD_REQUEST);
    // }
    throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
  }
  }


  async findAll() {
    return await this.model.find().populate('comments').populate('author').populate('liked_by').exec();
    // return `This action returns all posts`;
  }

  async findOne(id: string) {
    return await this.model.findById(id).populate('comments').populate('author').populate('liked_by')
    .select('-liked_by.Likes')
    .select('-liked_by.following')
    .select('-liked_by.followed_by')
    .exec();
    // return `This action returns a #${id} post`;
  }

  // async update(id: number, updatePostDto: UpdatePostDto) {
    async update(id: string, updatePostDto) {
    // return `This action updates a #${id} post`;
    return await this.model.findByIdAndUpdate(id, updatePostDto).populate('comments').populate('author').populate('liked_by').exec();
  }
  async like(id: string,updatePostDto: UpdatePostDto) {
  
    console.log("updatePostDto",updatePostDto)
    try {
    // return await new this.model({
    //   ...updatePostDto,
    //   update_date: new Date(),
    // }).save();
    let likeupdate =   this.model.updateOne({_id:id},{$addToSet:{'liked_by':updatePostDto.userId}})
    .then(async res=>{
       return this.usermodel.updateOne({_id:updatePostDto.userId},{$addToSet:{'Likes':id}}).exec() 
    })
    if(likeupdate){
      return this.findOne(id)
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

  async unlike(id: string,updatePostDto: UpdatePostDto) {
  
    console.log("unlike updatePostDto",updatePostDto)
    try {
    // return await new this.model({
    //   ...updatePostDto,
    //   update_date: new Date(),
    // }).save();
    let likeupdate = await  this.model.updateOne({_id:id},{$pull:{ 'liked_by':updatePostDto.userId}}).exec()
    console.log("likeupdate results",likeupdate)
    if(likeupdate){
      return this.findOne(id)
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

  async remove(id: string) {
    // return `This action removes a #${id} post`;
    return await this.model.findByIdAndDelete(id).exec();
  }
}
