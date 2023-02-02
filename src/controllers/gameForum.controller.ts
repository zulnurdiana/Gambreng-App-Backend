import { Request, Response } from 'express'
import { GameForumService } from '../services';
import { getResponse, getHttpCode } from '@/utils';

const gameForumService = new GameForumService();

export const getAll = async (req: Request, res: Response) => {
  const result = await gameForumService.getAllGameForum();
  if (result.status === 'failed') {
    return getResponse(res, getHttpCode.FORBIDDEN, result.data, {});
  }
  return getResponse(res, getHttpCode.OK, 'Success get Game Forum', result.data);
}

export const getById = async (req: Request, res: Response) => {
  const id = req.params.id
  const result = await gameForumService.getGameForumById(id);
  if (result.status === 'failed') {
    return getResponse(res, getHttpCode.FORBIDDEN, result.data, {});
  }
  return getResponse(res, getHttpCode.OK, 'Success get Game Forum', result.data);
}

