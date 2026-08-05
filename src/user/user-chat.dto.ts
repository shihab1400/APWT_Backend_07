import {
  IsNotEmpty,
  IsString,
  MaxLength,
} from 'class-validator';

export class AskUserChatDTO {
  @IsString()
  @IsNotEmpty({
    message: 'Prompt is required',
  })
  @MaxLength(2000, {
    message: 'Prompt cannot exceed 2000 characters',
  })
  prompt: string;
}