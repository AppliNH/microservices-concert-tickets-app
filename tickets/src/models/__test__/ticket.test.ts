import { Ticket } from "../ticket.model";


it('implements Optimistic Concurrency Control', async (done) => {

    // Creates an instance of a ticket

    const ticket = Ticket.build({
        title:"Prince",
        price: 23,
        userId: "123"
    });

    // Save it to db

    await ticket.save();

    // Fetch it twice

    const fTicket1 = await Ticket.findById(ticket.id);
    const fTicket2 = await Ticket.findById(ticket.id);

    // Make two separate changes to the fetched tickets

    fTicket1!.set({price: 50});
    fTicket2!.set({price: 10});

    // Save the first fetched ticket

    await fTicket1!.save();

    // Save the second fetched ticket => which has an outdated version number => should thrown an error => "No matching document found for id 'BLABLA' version 0"
    try {
        await fTicket2!.save();
    } catch (error) {
        return done(); // Should go there
    }

    throw new Error('Should not reach this point.')


});