// Loads bootstrap and distributes it on all pages
// That's basically global CSS config for nextjs
import 'bootstrap/dist/css/bootstrap.css';

export default  ({ Component, pageProps }) => {
    return <Component {...pageProps} />
};