import { PartialType } from '@nestjs/mapped-types';
import { CreateCommentDto } from './create-comment.dto';
import { CommentDto } from "./comment.dto";
// export class UpdateCommentDto extends PartialType(CreateCommentDto) {}
export class UpdateCommentDto extends CommentDto {
  update_date?: Date
}
