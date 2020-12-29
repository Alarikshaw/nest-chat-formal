import { Catch, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';
import { Group, GroupMap } from './../group/entity/group.entity';
import { GroupMessage } from '../group/entity/groupMessage.entity';
import { UserMap } from '../friend/entity/friend.entity';
import { RCode } from 'src/common/constant/rcode';
import { nameVerify, passwordVerify } from 'src/common/tool/utils';

@Injectable()
export class UserService {
  @InjectRepository(User)
  private readonly userRepository: Repository<User>;
  
  // @InjectRepository(Group)
  // private readonly groupRepository: Repository<Group>;

  // @InjectRepository(GroupMap)
  // private readonly groupUserRepository: Repository<GroupMap>;

  // @InjectRepository(GroupMessage)
  // private readonly groupMessageRepository: Repository<GroupMessage>;

  // @InjectRepository(UserMap)
  // private readonly friendRepository: Repository<UserMap>;

  /**
   * 获取用户
   * @param userId 传入的用户id
   */
  protected async getUser(userId: string) {
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
  protected async postUsers(userIds: string) {
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
  protected async updateUserName(user: User) {
    try {
      const oldUser = await this.userRepository.findOne({ 
        userId: user.userId, 
        password: user.password
       });
      if (oldUser && nameVerify(user.userName)) {
         const isHaveName = await this.userRepository.findOne({
           userName: user.userName
         });
         if (isHaveName) {
           return { code: 1, msg: '用户名重复', data: '' };
         };
         const newUser = JSON.parse(JSON.stringify(oldUser));
         newUser.userName = user.userName;
         newUser.password = user.password;
         await this.userRepository.update(oldUser, newUser);
         return { msg: '更新用户名成功！', data: newUser };
      }
      return { code: RCode.FAIL, msg: '更新失败！', data: '' };
    } catch(e) {
      return { code: RCode.ERROR, msg: '更新用户名失败！', data: e };
    }
  }

  protected async updatePassword(user: User, password: string) {
    try {
      const oldUser = await this.userRepository.findOne({
        userId: user.userId, 
        userName: user.userName, 
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
}