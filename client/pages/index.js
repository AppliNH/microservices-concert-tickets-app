import axios from 'axios';
import buildClient from '../api/build-client';

const LandingPage = ({currentUser}) => {

    

    return <h1>Landing page of {currentUser?.email || null} </h1>;
}

// Called during the server-side rendering process
LandingPage.getInitialProps = async (context) => {
    
    console.log("[serverside] LandingPage.getInitialProps");
    const client = buildClient(context);

    try {
        const { data } = await client.get('/api/users/currentuser');
        return data;
    } catch (error) {
        console.log(error)
        return {}
    }
};

export default LandingPage;