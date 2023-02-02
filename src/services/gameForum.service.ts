import { GameForum } from '@/models/gameForum';
import { GameMessage } from '@/models/gameMessage';
import { User } from '@/models/user';
export class GameForumService {

  private failedOrSuccessRequest(status: string, data: any) {
    return {
      status,
      data
    }
  }

  async getAllGameForum() {
    try {
      const data = await GameForum.findAll({
        attributes: ['id', 'title'],
      });
      console.log(data);
      if (!data) {
        return this.failedOrSuccessRequest('failed', 'Failed to get data');
      }
      return this.failedOrSuccessRequest('success', data);
    } catch (error) {
      return this.failedOrSuccessRequest('failed', error);
    }
  }

  async getGameForumById(id: string) {
    try {
      const data = await GameForum.findOne({
        where: {
          id
        },
        include: [{
          model: GameMessage,
          as: 'game_messages',
          attributes: ['id', 'message'],
          include: [{
            model: User,
            as: 'users',
            attributes: ['email']
          }]
        }],
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