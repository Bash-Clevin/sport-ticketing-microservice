import { OrderCreatedEvent, Publisher, Subjects } from '@clevinbash/library';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
