# Microservices Concert Tickets App

This project shows an approach of a microservices implementation, as well as event-driven architecture.

The app is basically a platform where you can buy and sell concert tickets.
It implements tickets+orders listing and creation, as well as payments and expiration management.

`tickets`, `orders`, `expiration` and `payments` constitute the microservices of this system.

`common` is a common package used accross the microservices.

When a user buys a ticket, he creates an order. Then, the ticket is locked for 1 min (default), giving him the time to pay, or not, his order.

The `payments` service implements Stripe.

## Configuration to make this run

- You'll need [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/) and [minikube](https://kubernetes.io/docs/tasks/tools/install-minikube/) installed on your machine
- You'll need a stripe account, get your keys, and then create a `.stripe-secret.env` file at the root of the project
    - Populate it with `STRIPE_KEY=<secret-key>`and `PUBLIC_STRIPE_KEY=<public-key>`
- The github actions build and pushes the images to DockerHub, but to **my** repositories by using **my** username. So change that too.
    - My dockerhub username is `tmprimitivo`, replace it with your DockerHub username.
- If you want to deploy, the github actions workflow files are ready
    - I've made the config to deploy with [DigitalOcean](https://www.digitalocean.com/)
    - Once you've signed in, create a Kubernetes Cluster, and install+config your [doctl](https://github.com/digitalocean/doctl) on your local machine
    - You'll just have to change the cluster name in the Github actions file. The current name used is `concert-tickets-app`
    - Also, in `infra/k8s-prod/ingress-service.yml`, set your production hostname. Current one used is `furio.team`
- You'll also have to register a few secrets in your Github repo, so the GitHub CI can use them
    - `DIGITALOCEAN_ACCESS_TOKEN` -> Your DigitalOcean API key
    - `DOCKERHUB_TOKEN` -> Your Dockerhub token
    - `DOCKERHUB_USERNAME` -> Your Dockerhub username


- On local machine, set a `GITHUB_AUTH_TOKEN` env var with your Github Token value
- After starting up Minikube :
    - Get minikube's ip with `minikube ip`
    - Modifiy /etc/hosts to match the minikube's ip with "weconcert.dev" (`192.168.49.2     weconcert.dev`)
- Browse freely the `Makefile`, it contains a lot of things that might help you in dev mode

**ONE** last thing : 

 - If you decide to publish the `common` pkg to your own repo, you'll have to publish it to Github packages.
    - So, replace every `applinh` or `AppliNH` with your github username. They mostly lie in the `.npmrc` files or in the `Makefile`, but also in the `package.json` of `common`, `auth`, `payments`, `orders`, `expiration` and `tickets`.
    - You then can run `make pub-common` to publish to your Github packages
    - and `make sync-common-all` to install package in all the microservices.


## Local dev
- `make start-dev`
Then head to `https://weconcert.dev`.

If you've got a certificate error, just type "thisisunsafe" in the middle of the page, whithout selecting any input box.

If you wanna restart the app, and that minikube is already running and everything is configured properly, just run `skaffold dev`.