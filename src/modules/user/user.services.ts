import { Catch, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { User } from './entity/user.entity';
import { Group, GroupMap } from './../group/entity/group.entity';
import { GroupMessage } from '../group/entity/groupMessage.entity';
import { UserMap } from '../friend/entity/friend.entity';
import { RCode } from 'src/common/constant/rcode';
import { nameVerify, passwordVerify } from 'src/common/tool/utils';
import { FriendMessage } from '../friend/entity/friendMessage.entity';
import { createWriteStream } from 'fs';
import { join } from 'path';

@Injectable()
export class UserService {
  // @InjectRepository(User)
  // private readonly userRepository: Repository<User>;
  
  // @InjectRepository(Group)
  // private readonly groupRepository: Repository<Group>;

  // @InjectRepository(GroupMap)
  // private readonly groupUserRepository: Repository<GroupMap>;

  // @InjectRepository(GroupMessage)
  // private readonly groupMessageRepository: Repository<GroupMessage>;

  // @InjectRepository(UserMap)
  // private readonly friendRepository: Repository<UserMap>;

  // @InjectRepository(FriendMessage)
  //   private readonly friendMessageRepository: Repository<FriendMessage>;

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,

    @InjectRepository(GroupMap)
    private readonly groupUserRepository: Repository<GroupMap>,

    @InjectRepository(GroupMessage)
    private readonly groupMessageRepository: Repository<GroupMessage>,

    @InjectRepository(UserMap)
    private readonly friendRepository: Repository<UserMap>,
    
    @InjectRepository(FriendMessage)
    private readonly friendMessageRepository: Repository<FriendMessage>,
  ) {}
  /**
   * 获取用户
   * @param userId 传入的用户id
   */
  public async getUser(userId: string) {
    try {
      let data;
      if (userId) {
        data = await this.userRepository.findOne({
          where: { userId: userId }
        });
        return { msg: '获取用户成功！', data };
      };
    } catch (e) {
      return { code: RCode.ERROR, msg: '获取用户失败', data: e }; 
    }
  }

  /**
   *  获取用户信息
   * @param userIds 
   */
  public async postUsers(userIds: string) {
    try {
      if (userIds) {
        const userIdArr = userIds.split(',');
        const userArr = [];
        for (const userId of userIdArr) {
          if (userId) {
            const data = await this.userRepository.findOne({
              where: { userId: userId }
            });
            userArr.push(data);
          }
        }
        return { msg: '获取用户信息成功', data: userArr };
      }
      return { code: RCode.FAIL, msg: '获取用户信息失败' , data: null};
    } catch(e) {
      return { code: RCode.ERROR, msg: '获取用户信息失败', data: e };
    }
  }
  
  /**
   * 修改用户名
   * @param user 传入名
   */
  public async updateUserName(user: User) {
    try {
      const oldUser = await this.userRepository.findOne({ 
        userId: user.userId, 
        password: user.password
       });
      if (oldUser && nameVerify(user.username)) {
         const isHaveName = await this.userRepository.findOne({
           username: user.username
         });
         if (isHaveName) {
           return { code: 1, msg: '用户名重复', data: '' };
         };
         const newUser = JSON.parse(JSON.stringify(oldUser));
         newUser.username = user.username;
         newUser.password = user.password;
         await this.userRepository.update(oldUser, newUser);
         return { msg: '更新用户名成功！', data: newUser };
      }
      return { code: RCode.FAIL, msg: '更新失败！', data: '' };
    } catch(e) {
      return { code: RCode.ERROR, msg: '更新用户名失败！', data: e };
    }
  }

  /**
   *  修改密码
   * @param user 用户信息
   * @param password 旧用户密码
   */
  public async updatePassword(user: User, password: string) {
    try {
      const oldUser = await this.userRepository.findOne({
        userId: user.userId, 
        username: user.username, 
        password: user.password
      });
      if (oldUser && passwordVerify(password)) {
        const newUser = JSON.parse(JSON.stringify(oldUser));
        newUser.passWord = password;
        await this.userRepository.update(oldUser, newUser);
        return { msg: '更新用户密码成功！', data: newUser };
      }
      return { code: RCode.FAIL, msg: '更新失败！', data: '' };
    } catch(e) {
      return { code: RCode.ERROR, msg: '更新用户密码失败', data: e };
    }
  }

  /**
   * 更新用户信息
   * @param userId 
   */
  public async jurisdiction(userId: string) {
    const user = await this.userRepository.findOne({
      userId: userId
    });
    const newUser = JSON.parse(JSON.stringify(user));
    if (user.username === 'Alarikshaw') {
      newUser.role = 'admin';
      await this.userRepository.update(user, newUser);
      return {
        msg: '更新用户信息成功！',
        data: newUser
      };
    } else {
      return {
        msg: '更新用户信息失败！',
        data: ''
      };
    }
  }

  /**
   * 删除用户
   * @param uid 用户id
   * @param psw 密码
   * @param did 群id
   */
  public async delUser(
    uid: string,
    psw: string,
    did: string
  ) {
    try {
      const user = await this.userRepository.findOne({
        userId: uid,
        password: psw
      });
      if (user.role === 'admin' 
      && user.username === 'Alarikshaw') {
        // 被删用户自己的群
        const groups = await this.groupRepository.find({
          userId: did,
        });
        // 当删除用户本身时，对其信息进行处理
        for (const group of groups) {
          await this.groupRepository.delete({
            groupId: group.groupId
          });
          await this.groupUserRepository.delete({
            groupId: group.groupId
          });
          await this.groupMessageRepository.delete({
            groupId: group.groupId
          });
        }
        // 删除用户曾经加入群的痕迹
        await this.groupUserRepository.delete({
          userId: did
        });
        await this.groupMessageRepository.delete({
          userId: did
        });
        // 删除当前用户好友位
        await this.friendRepository.delete({userId: did});
        await this.friendRepository.delete({friendId: did});
        await this.friendMessageRepository.delete({userId: did});
        await this.friendMessageRepository.delete({friendId: did});
        await this.userRepository.delete({userId: did});

        return {
          msg: '用户删除成功！'
        };
      }
      return; 
    } catch(e) {
      return {
        code: RCode.ERROR,
        msg: '用户删除失败',
        data: e
      };
    }   
  }

  /**
   * 查找用户
   * @param username 
   */
  public async getUsersByName(username: string): Promise<any> {
    try {
      if (username) {
        const users = await this.userRepository.find({
          where: {
            username: Like(`%${username}%`)
          }
        });
        return {
          data: users
        };
      }
      return {
        code: RCode.FAIL,
        msg: '请输入用户名',
        data: null
      };
    } catch(e) {
      return {
        code: RCode.ERROR,
        msg: '查找用户错误',
        data: null,
      };
    }
  }

  public async setUserAvatar(user: User, file) {
    const newUser = await this.userRepository.findOne({
      userId: user.userId,
      password: user.password,
    });
    if (newUser) {
      const random = Date.now() + '&';
      const stream = createWriteStream(join('public/avatar', random + file.originalname));
      stream.write(file.buffer);
      newUser.avatar = `api/avatar/${random}${file.originalname}`;
      newUser.password = user.password;
      await this.userRepository.save(newUser);
      return { msg: '修改头像成功', data: newUser};
    } else {
      return {
        code: RCode.FAIL,
        msg: '修改头像失败！'
      };
    }
  }
}