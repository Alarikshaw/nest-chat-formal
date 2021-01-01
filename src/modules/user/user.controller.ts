import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UploadedFile, UseGuards } from '@nestjs/common';

import {  } from '@nestjs/typeorm';

import {  } from '@nestjs/platform-express';


import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('user')
@ApiTags('用户相关Api')
@UseGuards(AuthGuard('jwt'))
export class UserController {
    // constructor(
    //     private readonly userService
    // )

    @Get()
    @ApiOperation({ summary: '获取用户' })
    getUser(@Query('userId') userId: string) {
        return userId;
    };

    @Post()
    @ApiOperation({ summary: '获取用户信息' })
    postUsers(@Body('userIds') userIds: string) {
        return userIds;
    };

    @Patch('username')
    @ApiOperation({ summary: '更新用户名' })
    updateUserName(@Body() user) {
        return user;
    };
    
    @Patch('passWord')
    @ApiOperation({ summary: '更新密码' })
    updatePassword(@Body() user, @Query('passWord') passWord) {
        return 'passWord';
    };

    @Patch('/jurisdiction/:userId')
    @ApiOperation({ summary: '更新用户信息' })
    jurisdiction(@Param('userId') userId) {
        return userId;
    };

    @Delete()
    @ApiOperation({ summary: '删除用户(并映射至其他表)' })
    delUser(@Body() { uid, psw, did }) {
        return uid;
    };

    @Get('/findByName')
    @ApiOperation({ summary: '查找用户名' })
    getUserByName(@Body('username') username: string) {
        return username;
    };

    @Post('/avatar')
    @ApiOperation({ summary: '更新头像' })
    setUserAvatar(@Body() user, @UploadedFile() file) {
        return file;
    }
}
