import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService,private jwtService: JwtService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(@Body() createPostDto: CreatePostDto,@Req() request) {
    let token = request.cookies['access_token'];
    let decodedtoken =  this.jwtService.decode(token);

    console.log("decodedtoken",decodedtoken)
    createPostDto.author = decodedtoken['userId'];
    return this.postsService.create(createPostDto);
  }

  @Get()
  findAll() {
    return this.postsService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(id, updatePostDto);
  }

  @Post('like/:id')
  @UseGuards(AuthGuard('jwt'))
  like(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto,@Req() request) {
    let token = request.cookies['access_token'];
    let decodedtoken =  this.jwtService.decode(token);

    console.log("decodedtoken",decodedtoken)
    updatePostDto.userId = decodedtoken['userId'];
    return this.postsService.like(id, updatePostDto);
  }

  @Post('unlike/:id')
  @UseGuards(AuthGuard('jwt'))
  unlike(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto,@Req() request) {
    let token = request.cookies['access_token'];
    let decodedtoken =  this.jwtService.decode(token);

    console.log("decodedtoken",decodedtoken)
    updatePostDto.userId = decodedtoken['userId'];
    return this.postsService.unlike(id, updatePostDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  remove(@Param('id') id: string) {
    return this.postsService.remove(id);
  }
}
