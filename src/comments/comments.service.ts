import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { PostComment,CommentDocument } from 'src/schemas/comment.schema';
import { Post,PostDocument } from 'src/schemas/post.schema';
import { Model } from 'mongoose';
@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(PostComment.name) private readonly model: Model<CommentDocument>,
    @InjectModel(Post.name) private readonly postmodel: Model<PostDocument>,
  ) {}
  async create(createCommentDto: CreateCommentDto) {
    // return 'This action adds a new comment';
    console.log("createUserDto",createCommentDto)
    try {
    return await new this.model({
      ...createCommentDto,
      create_date: new Date(),
    }).save().then(async (comment)=>{

      console.log("comment data",comment)
      let updatepost = await this.postmodel.updateOne({ _id: createCommentDto.post },{$addToSet:{ 'comments': comment._id }}).exec()

      console.log("updatepost data",updatepost)
      if(updatepost){
        return comment;
      }
      else{
        throw new HttpException('Unable to add Comment', HttpStatus.INTERNAL_SERVER_ERROR);
      }
     
    })
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
    return `This action returns all comments`;
  }

  async findOne(id: number) {
    return `This action returns a #${id} comment`;
  }

  async update(id: number, updateCommentDto: UpdateCommentDto) {
    return `This action updates a #${id} comment`;
  }

  async remove(id: number) {
    return `This action removes a #${id} comment`;
  }
}
