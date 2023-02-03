import { GlobalMessage, GlobalMessageInput } from '@/models/globalMessage';
import { createGlobalMessageSchema, updateGlobalMessageSchema } from '@/dto';
import { User } from '@/models/user';

export class GlobalMessageService {
  private failedOrSuccessRequest(status: string, data: any) {
    return {
      status,
      data
    }
  }

  async createGlobalMessage(payload: GlobalMessageInput) {
    const validateArgs = createGlobalMessageSchema.safeParse(payload);
    if (!validateArgs.success) {
      return this.failedOrSuccessRequest('failed', validateArgs.error);
    }

    try {
      const data = await GlobalMessage.create({
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

  async getAllGlobalMessage() {
    try {
      const data = await GlobalMessage.findAll({
        attributes: ['id', 'message'],
        include: [{
          model: User,
          as: 'users',
          attributes: ['email']
        }]
      });
      if (!data) {
        return this.failedOrSuccessRequest('failed', 'Failed to get data');
      }
      return this.failedOrSuccessRequest('success', data);
    } catch (error) {
      return this.failedOrSuccessRequest('failed', error);
    }
  }
}