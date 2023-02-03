import { Request, Response } from 'express'
import { GlobalMessageService } from '../services';
import { getResponse, getHttpCode } from '@/utils';

const gameGlobalMessageService = new GlobalMessageService();

export const store = async (req: Request, res: Response) => {
  const userId = req.user.id
  const payload = {
    ...req.body,
    userId
  }
  const result = await gameGlobalMessageService.createGlobalMessage(payload);
  if (result.status === 'failed') {
    return getResponse(res, getHttpCode.FORBIDDEN, result.data, {});
  }
  return getResponse(res, getHttpCode.OK, 'Success send message', result.data);
}

export const getAll = async (req: Request, res: Response) => {
  const result = await gameGlobalMessageService.getAllGlobalMessage();
  if (result.status === 'failed') {
    return getResponse(res, getHttpCode.FORBIDDEN, result.data, {});
  }
  return getResponse(res, getHttpCode.OK, 'Success get Global Message', result.data);
}