import {  } from '@nestjs/common';
import { getRepository, Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Group, GroupMap } from './entity/group.entity';
import { GroupMessage } from './entity/groupMessage.entity';
import { RCode } from './../../common/constant/rcode';
import { User } from './../user/entity/user.entity';
import { GroupUserGather } from 'src/common/types/groupUser.dto';

export class GroupService {

    // @InjectRepository(Group)
    // private readonly groupRepository: Repository<Group>;

    // @InjectRepository(GroupMap)
    // private readonly groupUserRepository: Repository<GroupMap>;

    // @InjectRepository(GroupMessage)
    // private readonly groupMessageRepository: Repository<GroupMessage>;


    constructor(
        @InjectRepository(Group)
        private readonly groupRepository: Repository<Group>,
        @InjectRepository(GroupMap)
        private readonly groupUserRepository: Repository<GroupMap>,
        @InjectRepository(GroupMessage)
        private readonly groupMessageRepository: Repository<GroupMessage>,
      ) {}
    /**
     *  获取群信息
     * @param groupIds 群id
     */
    public async postGroups(groupIds: string) {
        try {
            if (groupIds) {
                const groupIdArr = groupIds.split(',');
                const groupArr = [];
                for (const groupId of groupIdArr) {
                    const data = await this.groupRepository.findOne({
                        groupId: groupId
                    });
                    groupArr.push(data);
                };
                return {
                    msg: '获取群信息成功！',
                    data: groupArr
                };
            }
            return {
                code: RCode.FAIL,
                msg: '获取群信息失败！',
                data: null,    
            };
        } catch(e) {
            return {
                code: RCode.ERROR,
                msg: '获取群失败！',
                data: e
            };
        }
    }

    /**
     * 获取用户群或者系统所有的群
     * @param userId 用户id
     */
    public async getUserGroups(userId?: string) {
        try {
            let data;
            if (userId) {
                data = await this.groupUserRepository.find({
                    userId: userId
                });
                return {
                    msg: '获取用户所有群成功！',
                    data
                };
            }
            data = await this.groupUserRepository.find();
            return {
                msg: '获取系统所有群成功', 
                data
            };
        } catch(e) {
            return {
                code: RCode.ERROR, 
                msg: '获取用户的群失败',
                data: e
            };
        }
    }

    /**
     * 获取当前群的所有用户
     * @param groupId 
     */
    public async getGroupUsers(groupId: string) {
        try {
            let data;
            if (groupId) {
                data = await this.groupUserRepository.find({
                    groupId: groupId
                });
                return {
                    msg: '获取群的所有用户成功！',
                    data
                };
            }
        } catch(e) {
            return {
                code: RCode.ERROR,
                msg: '获取群的用户失败！',
                data: e
            };
        }
    }

    /**
     * 获取群分页消息
     * @param groupId 群id
     * @param current 当前页
     * @param pageSize 目标页数
     */
    public async getGroupMessages(
        groupId: string,
        current: number,
        pageSize: number
    ) {
        let groupMessage = await getRepository(GroupMessage)
        .createQueryBuilder('groupMessage')
        .orderBy('groupMessage.time", "DESC')
        .where('groupMessage.groupId = :id', { id: groupId })
        .skip(current)
        .take(pageSize)
        .getMany();
        groupMessage = groupMessage.reverse();

        const userGather: GroupUserGather = {};
        let userArr: FriendDto[] = [];
        for (const message of groupMessage) {
            if (!userGather[message.userId]) {
                userGather[message.userId] = await getRepository(User)
                .createQueryBuilder('user')
                .where("user.userId = :id", { id: message.userId })
                .getOne();
            }
        }
        userArr = Object.values(userGather);
        return {
            msg: '',
            data: {
                messageArr: groupMessage,
                useArr: userArr
            }
        };
    }

    /**
     * 查找群
     * @param groupName 
     */
    public async getGroupsByName(groupName: string) {
        try {
            if (groupName) {
                const groups = await this.groupRepository.find({
                    groupName: Like(`%${groupName}%`)
                });
                return {
                    data: groups
                };
            }
            return {
                code: RCode.FAIL,
                msg: '请输入群昵称',
                data: null
            };
        } catch(e) {
            return {
                code: RCode.ERROR,
                msg: '查找群错误',
                data: null
            };
        }
    }
}