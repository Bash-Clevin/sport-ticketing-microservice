import { TicketCreatedEvent } from '@clevinbash/library';
import { natsWrapper } from '../../../nats-wrapper';
import { TicketCreatedListener } from '../ticket-created-listener';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../../models/ticket';

const setup = async () => {
  // create an instance of listener
  const listener = new TicketCreatedListener(natsWrapper.client);

  //  create a fake data event
  const data: TicketCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    title: 'test title',
    price: 10,
    userId: new mongoose.Types.ObjectId().toHexString(),
  };

  // create fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it('creates and saves a ticket', async () => {
  const { listener, data, msg } = await setup();

  // call the onMessage function
  await listener.onMessage(data, msg);

  // assert if massage was created
  const ticket = await Ticket.findById(data.id);
  expect(ticket).toBeDefined();
  expect(ticket!.title).toEqual(data.title);
  expect(ticket!.price).toEqual(data.price);
});

it('should acknowledge the message', async () => {
  const { listener, data, msg } = await setup();

  // call the onMessage function
  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
