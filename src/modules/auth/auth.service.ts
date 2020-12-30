import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './../user/entity/user.entity';
import { GroupMap } from './../group/entity/group.entity';
import { nameVerify, passwordVerify } from './../../common/tool/utils';
import { RCode } from './../../common/constant/rcode';

export class AuthService {

    @InjectRepository(User)
    private readonly userRepository: Repository<User>;

    @InjectRepository(GroupMap)
    private readonly groupUserRepository: Repository<GroupMap>;

    private readonly jwtService: JwtService;

    /**
     * 登录
     * @param data 
     */
    async login(data: User): Promise<any> {
        const user = await this.userRepository.findOne({
            userName: data.userName,
            password: data.password
        });
        if (!user) {
            return {
                code: 1,
                msg: '密码错误',
                data: ''
            };
        }
        if (!passwordVerify(data.password) || !nameVerify(data.userName)) {
            return {
                code: RCode.FAIL,
                msg: '注册校验不通过！',
                data: ''
            };
        }
        user.password = data.password;
        const payload = {
            userId: user.userId,
            password: data.password
        };
        return {
            msg: '登录成功',
            data: {
                user: user,
                token: this.jwtService.sign(payload)
            }
        };
    }


    /**
     * 注册
     * @param user 
     */
    async register(user: User): Promise<any> {
        const isHave = await this.userRepository.find({
            userName: user.userName
        });
        if (isHave.length) {
            return {
                code: RCode.FAIL,
                msg: '用户名重复',
                data: ''
            };
        }
        if (!passwordVerify(user.password) || !nameVerify(user.userName)) {
            return {
                code: RCode.FAIL,
                msg: '注册校验不通过',
                data: ''
            };
        }
        user.avatar = `api/avatar/avatar(${Math.round(Math.random()*19 +1)}).png`;
        user.role = 'user';
        const newUser = await this.userRepository.save(user);
        const payload = {userId: newUser.userId, password: newUser.password};
        await this.groupUserRepository.save({
            userId: newUser.userId,
            groupId: 'Nest实时通信',
        });
        return {
            msg: '注册成功！',
            data: {
                user: newUser,
                token: this.jwtService.sign(payload)
            }
        };
    }
}

