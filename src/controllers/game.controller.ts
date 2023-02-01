import { Request, Response } from 'express'
import { GameService } from '../services';
import { getResponse, getHttpCode } from '@/utils';
import fs from 'fs'

const gameService = new GameService();

export const store = async (req: Request, res: Response) => {
  const file = req.file

  if (!file) return getResponse(res, getHttpCode.FORBIDDEN, 'Image is required', {})

  const payload = {
    ...req.body,
    image: file.filename
  }

  const result = await gameService.create(payload);
  if (result.status === 'failed') {
    fs.unlinkSync(file.path)
    return getResponse(res, getHttpCode.FORBIDDEN, result.data, {});
  }
  return getResponse(res, getHttpCode.OK, 'Game has been created', result.data);
}

export const getAll = async (req: Request, res: Response) => {
  const page = req.query.page ? parseInt(req.query.page as string) : 1
  const limit = req.query.limit ? parseInt(req.query.limit as string) : 10
  const result = await gameService.getAll({ page, limit });

  if (result.status === 'failed') {
    return getResponse(res, getHttpCode.FORBIDDEN, 'Failed get Game', {});
  }
  return getResponse(res, getHttpCode.OK, 'Success get Game', result.data);

}

export const getById = async (req: Request, res: Response) => {
  const id = req.params.id as string
  const result = await gameService.getById(id);

  if (result.status === 'failed') {
    return getResponse(res, getHttpCode.FORBIDDEN, 'Failed get Game', {});
  }
  return getResponse(res, getHttpCode.OK, 'Success get Game', result.data);
}

export const update = async (req: Request, res: Response) => {
  const id = req.params.id
  const file = req.file
  const data = await gameService.getById(id)
  let image = file != null ? file?.filename : data.data.image

  const payload = {
    ...req.body,
    image: image
  }

  const result = await gameService.update(id, payload)

  if (file != null) {
    fs.unlinkSync(`./public/uploads/${data.data.image}`)
  }

  if (result.status === 'failed') {
    return getResponse(res, getHttpCode.FORBIDDEN, result.data, {});
  }
  return getResponse(res, getHttpCode.OK, 'Game has been updated', result.data);
}

export const destroy = async (req: Request, res: Response) => {
  const id = req.params.id
  const result = await gameService.delete(id)

  if (result.status === 'failed') {
    return getResponse(res, getHttpCode.FORBIDDEN, result.data, {});
  }
  return getResponse(res, getHttpCode.OK, 'Game has been deleted', result.data);
}