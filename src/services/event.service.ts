import Event from '@/models/event';
import { createEventSchema, deleteEventSchema, updateEventSchema, getAllEventSchema, getDetailEventSchema } from '@/dto';

export class EventService {
  private failedOrSuccessRequest(status: string, data: any) {
    return {
      status,
      data
    }
  }
}