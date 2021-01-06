import axios from 'axios';
import buildClient from '../api/build-client';

const LandingPage = ({currentUser}) => {

    return currentUser ? 
        <h1>Welcome {currentUser?.email || null}  </h1>
    :
        <h1>Not signed in </h1>;
}

// Called during the server-side rendering process
LandingPage.getInitialProps = async (context) => {

    console.log("[serverside] LandingPage.getInitialProps");
    const client = buildClient(context);

    try {
        const { data } = await client.get('/api/users/currentuser');
        return data;
    } catch (error) {
        console.log(error.response.data.errors)
        return {}
    }
};

export default LandingPage;