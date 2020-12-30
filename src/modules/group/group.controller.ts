import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { GroupService } from './group.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('group')
@ApiTags('聊天群相关接口')
@UseGuards(AuthGuard('jwt'))
export class GroupController {
    private readonly groupService: GroupService;

    /**
     * 获取群信息
     * @param groupIds 
     */
    @Post()
    @ApiOperation({ summary: '获取群信息' })
    postGroups(@Body('groupIds') groupIds: string) {
        return this.groupService.postGroups(groupIds);
    }

    /**
     * 获取用户群或者系统所有的群
     * @param userId 
     */
    @Get('/userGroup')
    @ApiOperation({ summary: '获取用户群或者系统所有的群' })
    getUserGroups(@Body('userId') userId: string) {
        return this.groupService.getUserGroups(userId);
    }

    /**
     * 获取当前群的所有用户
     * @param groupId 
     */
     @Get('/groupUser')
     @ApiOperation({ summary: '获取当前群的所有用户' })
     getGroupUsers(@Body('groupId') groupId: string) {
         return this.groupService.getGroupUsers(groupId);
     }

    /**
     * 查找群
     * @param groupName 
     */     
     @Get('/findByName')
     @ApiOperation({ summary: '查找群' })
     getGroupsByName(@Query('groupName') groupName: string) {
         return this.groupService.getGroupsByName(groupName);
     }

     /**
      * 获取群分页消息
      * @param groupId 群id
      * @param current 当前页
      * @param pageSize 目标页数
      */
     getGroupMessages(
         @Query('groupId') groupId: string,
         @Query('current') current: number,
         @Query('pageSize') pageSize: number
     ) {
         return this.groupService.getGroupMessages(groupId, current, pageSize);
     }
}