import { Listener, OrderCreatedEvent, Subjects } from '@clevinbash/library';
import { queueGroupName } from './queue-group-name';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../models/tickets';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    // Find ticket being reserved by the order
    const ticket = await Ticket.findById(data.ticket.id);

    if (!ticket) {
      throw new Error('Ticket not found');
    }

    // Reserve the ticket by setting orderId property
    ticket.set({ orderId: data.id });

    await ticket.save();

    msg.ack();
  }
}
