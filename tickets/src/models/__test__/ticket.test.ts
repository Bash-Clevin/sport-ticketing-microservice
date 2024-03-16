import { Ticket } from '../tickets';

it('implements optimistic concurrency control', async () => {
  const ticket = Ticket.build({
    title: 'test ticket',
    price: 5,
    userId: '123',
  });

  await ticket.save();

  const firstInstance = await Ticket.findById(ticket.id);
  const secondInstance = await Ticket.findById(ticket.id);

  firstInstance!.set({ price: 10 });
  secondInstance!.set({ price: 15 });

  await firstInstance!.save();

  // expect an error to be thrown when saving
  await expect(secondInstance!.save()).rejects.toThrow();
});
