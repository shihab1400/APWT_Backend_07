import {
  BadRequestException,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { GoogleGenAI } from '@google/genai';
import { Repository } from 'typeorm';
import {
  StressLevel,
  UserEntity,
} from './user.entity';
import {
  UserChatEntity,
  UserChatSender,
} from './user-chat.entity';

interface AiAssessment {
  reply: string;
  stressLevel: StressLevel;
}

@Injectable()
export class UserChatService {
  private readonly ai: GoogleGenAI | null;

  constructor(
    private readonly configService: ConfigService,

    @InjectRepository(UserChatEntity)
    private readonly chatRepository: Repository<UserChatEntity>,

    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {
    const apiKey =
      this.configService.get<string>('GEMINI_API_KEY');

    this.ai = apiKey
      ? new GoogleGenAI({ apiKey })
      : null;
  }

  async ask(
    userId: number,
    prompt: string,
  ): Promise<object> {
    if (!this.ai) {
      throw new ServiceUnavailableException(
        'GEMINI_API_KEY is missing',
      );
    }

    const user = await this.userRepository.findOne({
      where: {
        userId,
      },
    });

    if (!user) {
      throw new NotFoundException(
        'Non-Paid Patient account not found',
      );
    }

    const userMessage = this.chatRepository.create({
      userId,
      message: prompt,
      sender: UserChatSender.USER,
    });

    await this.chatRepository.save(userMessage);

    try {
      const response =
        await this.ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: `
You are a supportive mental wellness assistant.

Do not provide a medical diagnosis.

Analyze the user's message and return only valid JSON in this exact format:

{
  "reply": "A short supportive response",
  "stressLevel": "low"
}

The stressLevel must be exactly one of:
low
medium
high

If the message suggests severe distress, recommend speaking with a qualified doctor.

User message:
${prompt}
`,
        });

      const assessment = this.parseAssessment(
        response.text ?? '',
      );

      const botMessage = this.chatRepository.create({
        userId,
        message: assessment.reply,
        sender: UserChatSender.BOT,
      });

      await this.chatRepository.save(botMessage);

      user.latestStressLevel =
        assessment.stressLevel;

      await this.userRepository.save(user);

      return {
        message: assessment.reply,
        stressLevel: assessment.stressLevel,
        shouldBookDoctor:
          assessment.stressLevel === StressLevel.HIGH,
        notice:
          'This is a wellness screening and not a medical diagnosis.',
      };
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : 'Unknown AI service error';

      throw new BadRequestException(
        `AI Bot error: ${message}`,
      );
    }
  }

  async getHistory(
    userId: number,
  ): Promise<UserChatEntity[]> {
    return this.chatRepository.find({
      where: {
        userId,
      },
      order: {
        createdAt: 'ASC',
      },
    });
  }

  async deleteChat(
    userId: number,
    chatId: string,
  ): Promise<{ message: string }> {
    const chat = await this.chatRepository.findOne({
      where: {
        chatId,
        userId,
      },
    });

    if (!chat) {
      throw new NotFoundException(
        'Chat message not found',
      );
    }

    await this.chatRepository.remove(chat);

    return {
      message: 'Chat message deleted successfully',
    };
  }

  private parseAssessment(
    responseText: string,
  ): AiAssessment {
    const cleanedText = responseText
      .replace(/^```json/i, '')
      .replace(/^```/i, '')
      .replace(/```$/i, '')
      .trim();

    try {
      const parsed = JSON.parse(
        cleanedText,
      ) as {
        reply?: unknown;
        stressLevel?: unknown;
      };

      const reply =
        typeof parsed.reply === 'string'
          ? parsed.reply
          : 'Thank you for sharing how you feel.';

      return {
        reply,
        stressLevel: this.getStressLevel(
          parsed.stressLevel,
        ),
      };
    } catch {
      return {
        reply:
          responseText ||
          'Thank you for sharing how you feel.',
        stressLevel: StressLevel.MEDIUM,
      };
    }
  }

  private getStressLevel(
    value: unknown,
  ): StressLevel {
    if (value === StressLevel.LOW) {
      return StressLevel.LOW;
    }

    if (value === StressLevel.HIGH) {
      return StressLevel.HIGH;
    }

    return StressLevel.MEDIUM;
  }
}