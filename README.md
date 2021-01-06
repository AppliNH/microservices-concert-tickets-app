# concert-tickets-app

## dev
- `minikube start`
- `minikube addons enable ingress`
- `kubectl expose deployment ingress-nginx-controller --target-port=80 --type=NodePort -n kube-system` exposes the nginx ingress
- Get minikube's ip with `minikube ip`
- Modifiy /etc/hosts to match the minikube's ip with "weconcert.dev" (`192.168.49.2     weconcert.dev`)
- Generate the secrets
- `skaffold dev`
