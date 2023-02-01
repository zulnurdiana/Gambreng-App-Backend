import { Request, Response } from 'express'
import { EventService } from '../services';
import { getResponse, getHttpCode } from '@/utils';
import fs from 'fs'

const eventService = new EventService();

export const createEvent = async (req: Request, res: Response) => {
  const file = req.file

  if (!file) return getResponse(res, getHttpCode.FORBIDDEN, 'Image is required', {})

  const payload = {
    ...req.body,
    image: file.filename
  }

  const result = await eventService.createEvent(payload);
  if (result.status === 'failed') {
    fs.unlinkSync(file.path)
    return getResponse(res, getHttpCode.FORBIDDEN, result.data, {});
  }
  return getResponse(res, getHttpCode.OK, 'Event has been created', result.data);
}

export const getAllEvent = async (req: Request, res: Response) => {
  const page = req.query.page ? parseInt(req.query.page as string) : 1
  const limit = req.query.limit ? parseInt(req.query.limit as string) : 10
  const result = await eventService.getAllEvent({ page, limit });

  if (result.status === 'failed') {
    return getResponse(res, getHttpCode.FORBIDDEN, 'Failed get Event', {});
  }
  return getResponse(res, getHttpCode.OK, 'Success get Event', result.data);

}

export const getById = async (req: Request, res: Response) => {
  const id = req.params.id as string
  const result = await eventService.getById(id);

  if (result.status === 'failed') {
    return getResponse(res, getHttpCode.FORBIDDEN, 'Failed get Event', {});
  }
  return getResponse(res, getHttpCode.OK, 'Success get Event', result.data);
}

export const update = async (req: Request, res: Response) => {
  const id = req.params.id
  const file = req.file
  const data = await eventService.getById(id)
  let image = file != null ? file?.filename : data.data.image

  const payload = {
    ...req.body,
    image: image
  }

  const result = await eventService.updateEvent(id, payload)

  if (file != null) {
    fs.unlinkSync(data.data.image)
  }

  if (result.status === 'failed') {
    fs.unlinkSync(file?.path as string)
    return getResponse(res, getHttpCode.FORBIDDEN, result.data, {});
  }
  return getResponse(res, getHttpCode.OK, 'Event has been updated', result.data);
}

export const destroy = async (req: Request, res: Response) => {
  const id = req.params.id
  const result = await eventService.deleteEvent(id)

  if (result.status === 'failed') {
    return getResponse(res, getHttpCode.FORBIDDEN, result.data, {});
  }
  return getResponse(res, getHttpCode.OK, 'Event has been deleted', result.data);
}