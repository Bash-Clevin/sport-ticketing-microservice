import { Publisher, Subjects, TicketUpdatedEvent } from '@clevinbash/library';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
