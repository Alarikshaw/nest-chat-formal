import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';


import { FileInterceptor } from '@nestjs/platform-express';


import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.services';

@Controller('user')
@ApiTags('用户相关Api')
@UseGuards(AuthGuard('jwt'))
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get()
    @ApiOperation({ summary: '获取用户' })
    getUser(@Query('userId') userId: string) {
        return this.userService.getUser(userId);
    };

    @Post()
    @ApiOperation({ summary: '获取用户信息' })
    postUsers(@Body('userIds') userIds: string) {
        return this.userService.postUsers(userIds);
    };

    @Patch('username')
    @ApiOperation({ summary: '更新用户名' })
    updateUserName(@Body() user) {
        return this.userService.updateUserName(user);
    };
    
    @Patch('passWord')
    @ApiOperation({ summary: '更新密码' })
    updatePassword(@Body() user, @Query('password') password) {
        return this.userService.updatePassword(user, password);
    };

    @Patch('/jurisdiction/:userId')
    @ApiOperation({ summary: '更新用户信息' })
    jurisdiction(@Param('userId') userId) {
        return this.userService.jurisdiction(userId);
    };

    @Delete()
    @ApiOperation({ summary: '删除用户(并映射至其他表)' })
    delUser(@Body() { uid, psw, did }) {
        return this.userService.delUser(uid, psw, did);
    };

    @Get('/findByName')
    @ApiOperation({ summary: '查找用户名' })
    getUserByName(@Body('username') username: string) {
        return this.userService.getUsersByName(username);
    };

    @Post('/avatar')
    @ApiOperation({ summary: '更新头像' })
    @UseInterceptors(FileInterceptor('avatar'))
    setUserAvatar(@Body() user, @UploadedFile() file) {
        console.log('user', user);
        return this.userService.setUserAvatar(user, file);
    }
}
