import { Controller, Get, Post, Body, Patch, Param, Delete, Res, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService,private jwtService: JwtService) {}

  @Post('signup')
  async create(@Body() createUserDto: CreateUserDto){
    console.log("controller createUserDto",createUserDto)
    // return 'create'
    let createdUser = await this.usersService.create(createUserDto);
  //  if(createdUser._id){
  //   return {_id: createdUser._id, firstname:createdUser.firstname ,lastname:createdUser.lastname,email:createdUser.email}
  //  }

   return createdUser
  
  }
  @Post('login')
  async login(@Body() cred: {username:string,password:string},@Res() response: Response) {
    // return 'login'
    let loggedUser = await this.usersService.login(cred);
    const payload = {
      firstname: loggedUser.firstname, 
      lastname: loggedUser.lastname,
      userId: loggedUser._id,
      email: loggedUser.email,      
    };
    // const payload = { userId: loggedUser._id };

    // const token = this.jwtService.sign(payload);
    const token = await this.jwtService.signAsync(payload);
 let decodedtoken =  this.jwtService.decode(token);

    console.log("decodedtoken",decodedtoken)


    response
    .cookie('access_token', token, {
        httpOnly: true,
        // domain: 'localhost', // your domain here!
        // domain: 'herokuapp.com', // your domain here!
        domain: 'fleetsimplify-test.herokuapp.com', // your domain here!
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
      })
      .send({ success: true,user:payload });

  }

  @Get()
  findAll() {
    
    return this.usersService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }
  @Post('follow/:id')
  @UseGuards(AuthGuard('jwt'))
  follow(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto,@Req() request) {
    let token = request.cookies['access_token'];
    let decodedtoken =  this.jwtService.decode(token);

    console.log("decodedtoken",decodedtoken)
    updateUserDto._id = decodedtoken['userId'];
    return this.usersService.follow(id, updateUserDto);
  }

  @Post('unfollow/:id')
  @UseGuards(AuthGuard('jwt'))
  unfollow(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto,@Req() request) {
    let token = request.cookies['access_token'];
    let decodedtoken =  this.jwtService.decode(token);

    console.log("decodedtoken",decodedtoken)
    updateUserDto._id = decodedtoken['userId'];
    return this.usersService.unfollow(id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
