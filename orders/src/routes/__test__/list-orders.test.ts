import request from 'supertest';
import { Ticket } from '../../models/ticket';
import { app } from '../../app';
import mongoose from 'mongoose';

const buildTicket = async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20,
  });
  await ticket.save();
  return ticket;
};

it('should fetch orders for a particular user', async () => {
  const userOneToken = global.signin();
  const userTwoToken = global.signin();

  // Create three tickets
  const ticketOne = await buildTicket();
  const ticketTwo = await buildTicket();
  const ticketThree = await buildTicket();

  // Create an order as user 1
  await request(app)
    .post('/api/orders')
    .set('Cookie', userOneToken)
    .send({ ticketId: ticketOne.id })
    .expect(201);

  // Create two orders as user 2
  const { body: orderOne } = await request(app)
    .post('/api/orders')
    .set('Cookie', userTwoToken)
    .send({ ticketId: ticketTwo.id })
    .expect(201);

  const { body: orderTwo } = await request(app)
    .post('/api/orders')
    .set('Cookie', userTwoToken)
    .send({ ticketId: ticketThree.id })
    .expect(201);

  // Make request to get order for user 2
  const response = await request(app)
    .get('/api/orders')
    .set('Cookie', userTwoToken)
    .expect(200);

  // Assert only user 2 tickets are returned
  expect(response.body.length).toEqual(2);
  expect(response.body[0].id).toEqual(orderOne.id);
  expect(response.body[1].id).toEqual(orderTwo.id);
  expect(response.body[0].ticket.id).toEqual(ticketTwo.id);
  expect(response.body[1].ticket.id).toEqual(ticketThree.id);
});
