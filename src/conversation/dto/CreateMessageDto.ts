import { IsInt, IsString, isString } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  content: string;

  @IsInt()
  sender: number;

  @IsInt()
  conversationId: number;
}
