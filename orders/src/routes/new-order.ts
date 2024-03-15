import {
  BadRequestError,
  NotFoundError,
  OrderStatus,
  requireAuth,
} from '@clevinbash/library';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import mongoose from 'mongoose';
import { Ticket } from '../models/ticket';
import { Order } from '../models/order';

const router = express.Router();
const EXPIRATION_WINDOW_SECONDS = 15 * 60;

router.post(
  '/api/orders',
  requireAuth,
  [
    body('ticketId')
      .notEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage('TicketId must be provided'),
  ],
  async (req: Request, res: Response) => {
    const { ticketId } = req.body;

    // find ticket user is trying to order
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      throw new NotFoundError();
    }

    // check if ticket is not reserved
    const isReserved = await ticket.isReserved();
    if (isReserved) {
      throw new BadRequestError('Ticket is already reserved');
    }

    // Calculate an expiration date for the order
    const expirationDate = new Date();
    expirationDate.setSeconds(
      expirationDate.getSeconds() + EXPIRATION_WINDOW_SECONDS,
    );

    // Build order and save it to db
    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt: expirationDate,
      ticket,
    });

    await order.save();

    res.status(201).send(order);
  },
);

export { router as newOrderRouter };
