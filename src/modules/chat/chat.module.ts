import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NestChatFoamal } from './chat.geteway';
import { User } from '../user/entity/user.entity';
import { Group, GroupMap } from '../group/entity/group.entity';
import { GroupMessage } from '../group/entity/groupMessage.entity';
import { UserMap } from '../friend/entity/friend.entity';
import { FriendMessage } from '../friend/entity/friendMessage.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Group, GroupMap, GroupMessage, UserMap, FriendMessage])
  ],
  providers: [NestChatFoamal],
})
export class ChatModule {
  @InjectRepository(Group)
  private readonly groupRepository: Repository<Group>;

  async onModuleInit() {
    const defaultGroup = await this.groupRepository.find({groupName: 'Nest实时通信'});
    if(!defaultGroup.length) {
      await this.groupRepository.save({
        groupId: 'Nest实时通信',
        groupName: 'Nest实时通信',
        userId: 'admin',
        createTime: new Date().valueOf()
      });
      console.log('create default group Nest实时通信');
    }
  }
}