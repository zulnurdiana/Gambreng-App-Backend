import { GameMessage, GameMessageInput } from '@/models/gameMessage';
import { createGameMessageSchema, updateGameMessageSchema, getGameMessageSchema } from '@/dto';
import { getAll } from '@/common/types';
export class GameMessageService {

  private failedOrSuccessRequest(status: string, data: any) {
    return {
      status,
      data
    }
  }

  async createGameMessage(payload: GameMessageInput) {
    const validateArgs = createGameMessageSchema.safeParse(payload);
    if (!validateArgs.success) {
      return this.failedOrSuccessRequest('failed', validateArgs.error);
    }

    try {
      const data = await GameMessage.create({
        gameForumId: payload.gameForumId,
        userId: payload.userId,
        message: payload.message
      });

      if (!data) {
        return this.failedOrSuccessRequest('failed', 'Failed to send message');
      }

      return this.failedOrSuccessRequest('success', data);

    } catch (error) {
      return this.failedOrSuccessRequest('failed', error);
    }
  }
}