import { OrderCancelledEvent, Publisher, Subjects } from '@clevinbash/library';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
