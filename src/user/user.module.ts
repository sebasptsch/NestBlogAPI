import {
  forwardRef,
  Module,
} from '@nestjs/common';
import { PostModule } from 'src/post/post.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [forwardRef(() => PostModule)],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
