import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AskUserChatDTO } from './user-chat.dto';
import { UserChatEntity } from './user-chat.entity';
import { UserChatService } from './user-chat.service';
import { UserAuthGuard } from './userAuth/userAuth.guard';
import type { RequestWithUser } from './userAuth/userAuth.guard';

@Controller('users/chat')
@UseGuards(UserAuthGuard)
export class UserChatController {
  constructor(
    private readonly userChatService: UserChatService,
  ) {}

  @Post('ask')
  ask(
    @Req() request: RequestWithUser,
    @Body() dto: AskUserChatDTO,
  ): Promise<object> {
    return this.userChatService.ask(
      request.user.sub,
      dto.prompt,
    );
  }

  @Get('history')
  getHistory(
    @Req() request: RequestWithUser,
  ): Promise<UserChatEntity[]> {
    return this.userChatService.getHistory(
      request.user.sub,
    );
  }

  @Delete('history/:chatId')
  deleteChat(
    @Req() request: RequestWithUser,
    @Param('chatId') chatId: string,
  ): Promise<{ message: string }> {
    return this.userChatService.deleteChat(
      request.user.sub,
      chatId,
    );
  }
}