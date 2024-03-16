import request from 'supertest';
import { Ticket } from '../../models/ticket';
import { app } from '../../app';

it('should fetch an order', async () => {
  // create a ticket
  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
  });
  await ticket.save();

  // make a request to build an order
  const userToken = global.signin();

  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', userToken)
    .send({ ticketId: ticket.id })
    .expect(201);

  // make request to fetch the order
  const { body: fetchedOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', userToken)
    .send()
    .expect(200);

  expect(fetchedOrder.id).toEqual(order.id);
});

it('should return an error if another user tries to access another persons orders', async () => {
  // create a ticket
  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
  });
  await ticket.save();

  // make a request to build an order
  const userToken = global.signin();

  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', userToken)
    .send({ ticketId: ticket.id })
    .expect(201);

  // make request to fetch the order
  await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', global.signin())
    .send()
    .expect(401);
});
