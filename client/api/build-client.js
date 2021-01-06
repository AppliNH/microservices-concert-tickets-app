import axios from 'axios';

// Handles server-side of client-side api calls
export default ({ req }) => {

    // Need to reach out to the ingress nginx from the nextjs pod
    // ... through the namespace of the ingress nginx, named "ingress-nginx"
    // Reach out the namespace => http://NAMEofSERVICE.NAMESPACE.svc.cluster.local
    // In our case the namespace is https://kubernetes.github.io/ingress-nginx/deploy/#verify-installation

    // but first, you've got to expose it `kubectl expose deployment ingress-nginx-controller --target-port=80 --type=NodePort -n kube-system`


    if (typeof window === 'undefined') {
        // Server

        return axios.create({
            baseURL: 'http://ingress-nginx-controller.kube-system.svc.cluster.local',
            headers: req.headers // Forward headers which contains host + cookie
        });

        // ^ {
                // headers: {
                //     Host: req.headers.host, // NEEDED, matches the `host` key in ingress config => 'weconcert.dev'
                //     Cookie: req.Cook
                //   },

    } else {
        // Browser

        return axios.create({
            baseURL:'/'
        })
    }

};