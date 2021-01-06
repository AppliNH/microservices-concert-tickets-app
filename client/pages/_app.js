// Loads bootstrap and distributes it on all pages
// That's basically global CSS config for nextjs

// This is the root of the whole app

// Be careful the name of the file has to be "_app"
import 'bootstrap/dist/css/bootstrap.css';
import buildClient from '../api/build-client';
import Header from '../components/header';


const AppComponent =  ({ Component, pageProps, currentUser }) => {
    return (
    <div>
        <Header currentUser={currentUser}/>
        <Component {...pageProps} />
    </div>);
};



// Called during the server-side rendering process

// context is built differently in page component and in custom app component
// Page : context === {req, res}
// Custom App : appContext === {Component, ctx: {req, res}}

AppComponent.getInitialProps = async (appContext) => {

    const {ctx} = appContext;
    const client = buildClient(ctx);

    try {
        const { data } = await client.get('/api/users/currentuser');
        // This getInitialProps will override the getInitialProps of the children.
        // But you can manually trigger them from here, and forward context.

        let pageProps;
        if (appContext.Component.getInitialProps) { // Check if defined
            pageProps = await appContext.Component.getInitialProps(appContext.ctx);
        }

        // ^ This will dispatch the context to all children components
        
        return {
            pageProps,
            ...data
        }
        
    } catch (error) {
        console.log(error.response.data);
        return {}
    }


};

export default AppComponent;