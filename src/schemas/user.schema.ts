import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import{UserDto} from '../users/dto/user.dto'
import { compare, hash } from 'bcrypt';
import { from, Observable } from 'rxjs';

export type UserDocument = User & Document;
// const User = mongoose.model<IUser & Document>("users", UserSchema);

interface  IUser extends Document  {
  firstname: string
  lastname:string
  email:string
    password: string
  
}

@Schema()
export class User {

  @Prop()
  firstname: string;
  @Prop()
  lastname: string;

  @Prop()
  email: string;

  @Prop()
  password: string;



}


export const UserSchema = SchemaFactory.createForClass(User);
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

function comparePasswordMethod(password: string): Observable<any> {
  return from(compare(password, this.password));
}
UserSchema.methods.isPassword = comparePasswordMethod;

