import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission} from './permission.entity';
import { UserController } from './user.controller';
import { User } from './user.entity';
import { UserService } from './user.service';


@Module({
  imports: [TypeOrmModule.forFeature([User]),TypeOrmModule.forFeature([Permission])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]

})
export class UserModule {}
