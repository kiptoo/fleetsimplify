import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document ,Types } from 'mongoose';
import { User } from './user.schema';
import { Post } from './post.schema';


export type CommentDocument = PostComment & Document;
// const User = mongoose.model<IUser & Document>("users", UserSchema);

@Schema()
export class PostComment extends Document {


  @Prop({ type: Types.ObjectId, ref: 'User' })
  author: User;


  @Prop({ type: Types.ObjectId, ref: 'Post' })
  post: Post;

  @Prop({required: true})
  content: string;
  
  @Prop({required: true,default:new Date()})
  create_date: Date; 


}

export const CommentSchema = SchemaFactory.createForClass(PostComment);


