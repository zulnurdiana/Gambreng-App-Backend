import { Request, Response } from 'express';
import { EventService } from '../services';
import { getResponse, getHttpCode } from '@/utils';

const eventService = new EventService();
