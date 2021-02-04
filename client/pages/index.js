import axios from 'axios';
import Link from 'next/link';
import buildClient from '../api/build-client';

const LandingPage = ({currentUser, tickets}) => {

    const ticketList = tickets?.map(ticket => {
        return (
            <tr key={ticket.id}>
                <td>{ticket.title}</td>
                <td>{ticket.price}</td>
                <td>
                    <Link href={'/tickets/[ticketId]'} as={`/tickets/${ticket.id}`}>
                        <a>View</a>
                    </Link>
                </td>
            </tr>
        );
    });

    return (
            <div>
                <h1>Tickets</h1>
                <table className="table">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Price</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {ticketList}
                    </tbody>
                </table>
            </div>
        );
}

// Called during the server-side rendering process
LandingPage.getInitialProps = async (context, client, currentUser) => {

    const { data } = await client.get("/api/tickets");

    return { tickets: data };
};

export default LandingPage;