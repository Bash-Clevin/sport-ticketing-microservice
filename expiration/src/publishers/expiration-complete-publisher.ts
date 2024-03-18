import {
  ExpirationCompleteEvent,
  Publisher,
  Subjects,
} from '@clevinbash/library';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
