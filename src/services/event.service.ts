import { Event, EventInput } from '@/models/event';
import { createEventSchema, deleteEventSchema, updateEventSchema, getAllEventSchema, getDetailEventSchema } from '@/dto';
import fs from 'fs';
import { getAll } from '@/common/types';

export class EventService {
  private failedOrSuccessRequest(status: string, data: any) {
    return {
      status,
      data
    }
  }

  async createEvent(payload: EventInput) {
    try {
      const validateArgs = createEventSchema.safeParse(payload);
      if (!validateArgs.success) {
        return this.failedOrSuccessRequest('failed', validateArgs.error);
      }
      const event = await Event.create({
        title: payload.title,
        image: payload.image,
        schedule: payload.schedule,
        location: payload.location,
        about: payload.about,
        contact_person: payload.contact_person,
        link_map: payload.link_map,
      });
      return this.failedOrSuccessRequest('success', event);
    } catch (error) {
      return this.failedOrSuccessRequest('failed', error);
    }
  }

  async getAllEvent(params: getAll) {
    try {
      const validateArgs = getAllEventSchema.safeParse(params)
      if (!validateArgs.success) {
        return this.failedOrSuccessRequest('failed', validateArgs.error);
      }

      const event = await Event.findAll({
        offset: (params.page - 1) * params.limit,
        limit: params.limit,
      })

      const total = await Event.count()
      const totalEvent = {
        totalRows: total,
        totalPage: Math.ceil(total / params.limit)
      }

      if (!event) {
        return this.failedOrSuccessRequest('failed', 'Event not found');
      }
      return this.failedOrSuccessRequest('success', { event, totalEvent })
    } catch (error) {
      return this.failedOrSuccessRequest('failed', error);
    }
  }

  async getById(id: string) {
    try {
      const validateArgs = getDetailEventSchema.safeParse({
        eventId: id
      })
      if (!validateArgs.success) {
        return this.failedOrSuccessRequest('failed', validateArgs.error);
      }
      const event = await Event.findByPk(id)
      if (!event) {
        return this.failedOrSuccessRequest('failed', 'Event not found');
      }
      return this.failedOrSuccessRequest('success', event)
    } catch (error) {
      return this.failedOrSuccessRequest('failed', error);
    }
  }

  async updateEvent(id: string, payload: EventInput) {
    try {
      const validateArgs = updateEventSchema.safeParse({
        eventId: id
      });
      if (!validateArgs.success) {
        return this.failedOrSuccessRequest('failed', validateArgs.error);
      }
      const event = await Event.update({
        title: payload.title,
        image: payload.image,
        schedule: payload.schedule,
        location: payload.location,
        about: payload.about,
        contact_person: payload.contact_person,
        link_map: payload.link_map,
      }, {
        where: {
          id: id
        }
      });
      return this.failedOrSuccessRequest('success', event);
    } catch (error) {
      return this.failedOrSuccessRequest('failed', error);
    }
  }

  async deleteEvent(id: string) {
    const validateArgs = deleteEventSchema.safeParse({
      eventId: id
    })
    if (!validateArgs.success) {
      return this.failedOrSuccessRequest('failed', validateArgs.error);
    }
    try {
      const findEvent = await Event.findByPk(id)

      if (!findEvent) return this.failedOrSuccessRequest('failed', 'Event not found');

      const event = await Event.destroy({
        where: {
          id: id
        }
      });
      if (event) {
        fs.unlinkSync(`./public/uploads/${findEvent.image}`)
      }
      return this.failedOrSuccessRequest('success', event);
    } catch (error) {
      return this.failedOrSuccessRequest('failed', error);
    }
  }

}