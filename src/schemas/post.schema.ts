import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document ,Types } from 'mongoose';

import { User } from '../users/entities/user.entity';
import { PostComment } from './comment.schema';

export type PostDocument = Post & Document;


@Schema()
export class Post extends Document {

  @Prop({required: true})
  title: string;
  
  @Prop({ type: Types.ObjectId, ref: 'User' })
  author: User;
  @Prop({type: [{ type: Types.ObjectId, ref: 'User' }]})
  liked_by: [User];

  @Prop({required: true})
  content: string;


  @Prop({ type: [{ type:Types.ObjectId, ref: 'PostComment' }]})
  comments: PostComment[];
  
  @Prop({required: true,default:new Date()})
  create_date: Date; 


}

export const PostSchema = SchemaFactory.createForClass(Post);


