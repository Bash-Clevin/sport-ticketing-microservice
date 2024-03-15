import { Stan } from 'node-nats-streaming';
import { Subjects } from './subjects';

interface Event {
  subject: Subjects;
  data: any;
}

export abstract class Publisher<T extends Event> {
  abstract subject: T['subject'];
  private stan: Stan;

  constructor(stan: Stan) {
    this.stan = stan;
  }

  publish(data: T['data']) {
    this.stan.publish(this.subject, JSON.stringify(data), () => {
      console.log('Event published.');
    });
  }
}
