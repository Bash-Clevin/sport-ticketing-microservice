import { Publisher, Subjects, TicketCreatedEvent } from '@clevinbash/library';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
