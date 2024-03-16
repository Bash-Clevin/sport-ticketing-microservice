import request from 'supertest';
import { Ticket } from '../../models/ticket';
import { app } from '../../app';
import { Order, OrderStatus } from '../../models/order';
import { natsWrapper } from '../../nats-wrapper';

it('marks an order as cancelled', async () => {
  // create ticket
  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
  });
  await ticket.save();

  // create an order
  const userToken = global.signin();

  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', userToken)
    .send({ ticketId: ticket.id })
    .expect(201);

  // cancel order
  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie', userToken)
    .send()
    .expect(204);

  // make sure order is cancelled in db
  const updatedOrder = await Order.findById(order.id);

  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('should emit order cancelled event', async () => {
  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
  });
  await ticket.save();

  // create an order
  const userToken = global.signin();

  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', userToken)
    .send({ ticketId: ticket.id })
    .expect(201);

  // cancel order
  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie', userToken)
    .send()
    .expect(204);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
