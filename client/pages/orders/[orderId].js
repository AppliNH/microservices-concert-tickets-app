import { useEffect, useState } from "react";
import StripeCheckout from 'react-stripe-checkout';
import getConfig from 'next/config'
import useRequest from "../../hooks/use-request";
import Router from "next/router";

const OrderShow = ({order, currentUser}) => {
    const { publicRuntimeConfig } = getConfig();
    const { processEnv } = publicRuntimeConfig;

    const [timeLeft, setTimeLeft] = useState(0);

    const {doRequest, errors} = useRequest({
        url:"/api/payments",
        method: "post",
        body: {
            orderId: order.id
        },
        onSuccess: () => Router.push('/orders')
    })

    useEffect(() => {
        
        const calcTimeLeft = () => {
            const millisecLeft = new Date(order.expiresAt) - new Date();
            setTimeLeft(Math.round(millisecLeft / 1000));
        };

        calcTimeLeft();
        const timerId = setInterval(calcTimeLeft, 1000);

        return () => { // Will be invoked when navigating away or re-render component
            clearInterval(timerId);
        };
    }, []);

    if (timeLeft < 0) {
        return(
            <div>
                Order has expired
            </div>
        );
    }

    

    return(
        <div>
            {timeLeft} seconds until order expires

            <StripeCheckout
                token={(token) => doRequest({token: token.id})}
                stripeKey={processEnv.PUBLIC_STRIPE_KEY}
                amount={order.ticket.price * 100}
                email={currentUser.email}
            />
        </div>
    );

};


OrderShow.getInitialProps = async (context, client) => {
    const {orderId} = context.query;
    const {data} = await client.get(`api/orders/${orderId}`);


    return {order: data}

};

export default OrderShow;