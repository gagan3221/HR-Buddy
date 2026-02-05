import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Groq from 'groq-sdk';
import { SYSTEM_PROMPT } from './system.prompt';

@Injectable()
export class ChatService {
  private groq: Groq;
  private readonly logger = new Logger(ChatService.name);

  constructor(private configService: ConfigService) {
    this.groq = new Groq({
      apiKey: this.configService.get<string>('GROQ_API_KEY'),
    });
  }

  async generateResponse(message: string, history: any[] = []) {
    try {
      // Construct messages array with system prompt
      const messages = [
        { role: 'system', content: SYSTEM_PROMPT },
        ...history, // Previous context
        { role: 'user', content: message },
      ];

      const completion = await this.groq.chat.completions.create({
        messages: messages as any,
        model: 'llama-3.3-70b-versatile', // Fast and capable
        temperature: 0.5,
        max_tokens: 1024,
      });

      const responseContent = completion.choices[0]?.message?.content || '';

      // Check if response contains JSON action
      // We look for the ```json ... ``` block or just raw json if the model forgets code blocks
      const jsonMatch = responseContent.match(/```json\n([\s\S]*?)\n```/) || responseContent.match(/({[\s\S]*"action":[\s\S]*})/);

      if (jsonMatch) {
        try {
            const jsonStr = jsonMatch[1] || jsonMatch[0];
            const actionData = JSON.parse(jsonStr);
            return {
                role: 'assistant',
                content: "I've prepared that for you.", // Fallback text
                action: actionData
            };
        } catch (e) {
            this.logger.error("Failed to parse JSON from LLM", e);
            // Fallback to returning raw text if parse fails
        }
      }

      return {
        role: 'assistant',
        content: responseContent,
        action: null
      };

    } catch (error) {
      this.logger.error('Error connecting to Groq API', error);
      throw error;
    }
  }
}
