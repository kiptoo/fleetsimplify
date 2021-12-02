import { PartialType } from '@nestjs/mapped-types';
import { CreatePostDto } from './create-post.dto';
import { PostDto } from "./post.dto";
// export class UpdatePostDto extends PartialType(CreatePostDto) {}
export class UpdatePostDto extends PostDto {

  update_date: Date
  userId?:string
}
