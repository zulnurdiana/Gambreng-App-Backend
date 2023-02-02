import { Request, Response } from 'express'
import { GameMessageService } from '../services';
import { getResponse, getHttpCode } from '@/utils';

const gameMessageService = new GameMessageService();

export const store = async (req: Request, res: Response) => {
  const userId = req.user.id
  const payload = {
    ...req.body,
    userId
  }
  const result = await gameMessageService.createGameMessage(payload);
  if (result.status === 'failed') {
    return getResponse(res, getHttpCode.FORBIDDEN, result.data, {});
  }
  return getResponse(res, getHttpCode.OK, 'Success send message', result.data);
}