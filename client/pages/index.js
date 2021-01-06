import axios from 'axios';

const LandingPage = ({currentUser}) => {

    

    return <h1>Landing page {currentUser?.email || null} </h1>;
}

// Called during the server-side rendering process
LandingPage.getInitialProps = async ({ req }) => {
    console.log("[serverside] LandingPage.getInitialProps");
    
    // Need to reach out to the ingress nginx from the nextjs pod
    // ... through the namespace of the ingress nginx, named "ingress-nginx"
    // Reach out the namespace => http://NAMEofSERVICE.NAMESPACE.svc.cluster.local
    // In our case the namespace is https://kubernetes.github.io/ingress-nginx/deploy/#verify-installation

    // but first, you've got to expose it `kubectl expose deployment ingress-nginx-controller --target-port=80 --type=NodePort -n kube-system`
    

    if (typeof window === 'undefined') {

        console.log('from the server');

        try {  

            const { data } = await axios.get(
                'http://ingress-nginx-controller.kube-system.svc.cluster.local/api/users/currentuser',
                    {headers: req.headers} // Forward headers which contains host + cookie
                
                );

            // ^ {
                // headers: {
                //     Host: req.headers.host, // NEEDED, matches the `host` key in ingress config => 'weconcert.dev'
                //     Cookie: req.Cook
                //   },
            
            return data
        } catch (error) {

            // No token provided error
            if (error.response.status == 400) {
                return {};
            }
            console.log(error.response.data.errors);
            return {}
        }

        
        
    } else {
        console.log("from the client");
        try {  
            const {data} = await axios.get('/api/users/currentuser');
            return data
        } catch (error) {

            // No token provided error
            if (error.response.status == 400) {
                return {};
            }
            console.log(error.response.data.errors);
            return {}
        }
        
    }



    
};

export default LandingPage;