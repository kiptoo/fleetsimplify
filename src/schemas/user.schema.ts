import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document,Types } from 'mongoose';
import {compare, hash } from 'bcrypt';
import { Post } from './post.schema';

export type UserDocument = User & Document;
// const User = mongoose.model<IUser & Document>("users", UserSchema);


@Schema()
export class User extends Document {

  @Prop({required: true})
  firstname: string;
  @Prop({required: true})
  lastname: string;

  @Prop({required: true})
  email: string;

  @Prop({required: true,select: false})
  password: string;

  @Prop({type: [{ type: Types.ObjectId, ref: 'User' }]})
  followed_by: [User];

  @Prop({type: [{ type: Types.ObjectId, ref: 'User' }]})
  following: [User];

  @Prop({type: [{ type: Types.ObjectId, ref: 'Post' }]})
  Likes: [Post];
  
  @Prop({required: true,default:new Date()})
  createdAt: Date; 
  comparePasswordMethod: Function;

}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.index({ "email": 1 }, { unique: true });
// export const UserSchema = new mongoose.Schema({
//   firstname: String,
//   lastname: Number,
//   email: String,
//   password: String,
//   CreatedAt: Date,
// });
// userSchema.pre<UserDto>("save", function save(next) {

// }
async function preSaveHook(next) {
  // Only run this function if password was modified
  if (!this.isModified('password')) return next();
  // Hash the password
  const password = await hash(this.password, 12);
  this.set('password', password);
  next();
}
UserSchema.pre<any>('save', preSaveHook);

// async function comparePasswordMethod(password: string): Promise<boolean> {
//   return compare(password, this.password);
// }
// UserSchema.methods.comparePassword  = comparePasswordMethod;
UserSchema.methods.comparePasswordMethod = async function (password: string): Promise<boolean> {
  return compare(password, this.password);
};
