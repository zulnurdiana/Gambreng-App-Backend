import { Game, GameInput } from '@/models/game';
import { createGameSchema, deleteGameSchema, updateGameSchema, getAllGameSchema, getDetailGameSchema } from '@/dto';
import fs from 'fs';
import { getAll } from '@/common/types';

export class GameService {
  private failedOrSuccessRequest(status: string, data: any) {
    return {
      status,
      data
    }
  }

  async create(payload: GameInput) {
    try {
      const validateArgs = createGameSchema.safeParse(payload);
      if (!validateArgs.success) {
        return this.failedOrSuccessRequest('failed', validateArgs.error);
      }
      const game = await Game.create({
        title: payload.title,
        image: payload.image,
        description: payload.description,
        max_player: payload.max_player,
        origin_game: payload.origin_game,
        procedure: payload.procedure,
        link_video: payload.link_video
      });
      return this.failedOrSuccessRequest('success', game);
    } catch (error) {
      return this.failedOrSuccessRequest('failed', error);
    }
  }

  async getAll(params: getAll) {
    try {
      const validateArgs = getAllGameSchema.safeParse(params)
      if (!validateArgs.success) {
        return this.failedOrSuccessRequest('failed', validateArgs.error);
      }

      const game = await Game.findAll({
        offset: (params.page - 1) * params.limit,
        limit: params.limit,
      })

      const total = await Game.count()
      const totalGame = {
        totalRows: total,
        totalPage: Math.ceil(total / params.limit)
      }

      if (!game) {
        return this.failedOrSuccessRequest('failed', 'Game not found');
      }
      return this.failedOrSuccessRequest('success', { game, totalGame })
    } catch (error) {
      return this.failedOrSuccessRequest('failed', error);
    }
  }

  async getById(id: string) {
    try {
      const validateArgs = getDetailGameSchema.safeParse({
        gameId: id
      })
      if (!validateArgs.success) {
        return this.failedOrSuccessRequest('failed', validateArgs.error);
      }
      const data = await Game.findByPk(id)
      if (!data) {
        return this.failedOrSuccessRequest('failed', 'Game not found');
      }
      return this.failedOrSuccessRequest('success', data)
    } catch (error) {
      return this.failedOrSuccessRequest('failed', error);
    }
  }

  async update(id: string, payload: GameInput) {
    try {
      const validateArgs = updateGameSchema.safeParse({
        gameId: id
      });
      if (!validateArgs.success) {
        return this.failedOrSuccessRequest('failed', validateArgs.error);
      }
      const game = await Game.update({
        title: payload.title,
        image: payload.image,
        description: payload.description,
        max_player: payload.max_player,
        origin_game: payload.origin_game,
        procedure: payload.procedure,
        link_video: payload.link_video
      }, {
        where: {
          id: id
        }
      });
      return this.failedOrSuccessRequest('success', {});
    } catch (error) {
      return this.failedOrSuccessRequest('failed', error);
    }
  }

  async delete(id: string) {
    const validateArgs = deleteGameSchema.safeParse({
      gameId: id
    })
    if (!validateArgs.success) {
      return this.failedOrSuccessRequest('failed', validateArgs.error);
    }
    try {
      const findGame = await Game.findByPk(id)

      if (!findGame) return this.failedOrSuccessRequest('failed', 'Game not found');

      const data = await Game.destroy({
        where: {
          id: id
        }
      });
      if (data) {
        fs.unlinkSync(`./public/uploads/${findGame.image}`)
      }
      return this.failedOrSuccessRequest('success', data);
    } catch (error) {
      return this.failedOrSuccessRequest('failed', error);
    }
  }

}