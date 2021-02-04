import axios from 'axios';
import buildClient from '../api/build-client';

const LandingPage = ({currentUser}) => {

    return currentUser ? 
        <h1>Welcome {currentUser?.email || null}  </h1>
    :
        <h1>Not signed in </h1>;
}

// Called during the server-side rendering process
LandingPage.getInitialProps = async (context, client, currentUser) => {

    return {}
};

export default LandingPage;