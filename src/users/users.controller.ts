import { Controller, Request, Patch, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UsersService } from './users.service';

@Controller({
  version: '1',
  path: 'api/users',
})
@ApiTags('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Patch()
  async update(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    const { _id } = req.user;
    return this.usersService.update(_id, updateUserDto);
  }
}
