import { Body, Controller, Get, Query, UseGuards } from '@nestjs/common';
import { FriendService } from './friend.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('friend')
@ApiTags('用户好友相关')
@UseGuards(AuthGuard('jwt'))
export class FriendController {
    constructor(private readonly friendService: FriendService) {}

    @Get()
    @ApiOperation({ summary: '获取用户好友' })
    getFriend(@Query('userId') userId: string) {
        return this.friendService.getFriends(userId);
    }

    @Get('/friendMessages')
    @ApiOperation({ summary: '获取当前用户私聊信息' })
    getFriendMessage(@Query() query: any) {
        return this.friendService.getFriendMessages(
            query.userId,
            query.friendId,
            query.current,
            query.pageSize
        );
    }
}
