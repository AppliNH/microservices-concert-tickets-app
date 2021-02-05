# Clean minikube
minikube-clean:
	-minikube delete
	minikube start
	minikube addons enable ingress

# Start-dev from scratch
start-dev:
	$(MAKE) minikube-clean	
	kubectl expose deployment ingress-nginx-controller --target-port=80 --type=NodePort -n kube-system
	kubectl create secret generic jwt-secret --from-literal=JWT_KEY=jwthash123
	kubectl create secret generic stripe-secret --from-env-file=./.stripe-secret.env
	skaffold dev
# Just publish common package and push code modifications from common/ to the repo
pub-common:
	@echo "Publish and push common package changes"
	cd common/ ; npm run pub

sync-common-all: sync-common-auth sync-common-tickets sync-common-orders sync-common-expiration sync-common-payments

# Reinstall the common pkg from the private npm repo
sync-common-auth:
	cd auth/ ; npm i @applinh/mcta-common

# Reinstall the common pkg from the private npm repo
sync-common-tickets:
	cd tickets/ ; npm i @applinh/mcta-common

# Reinstall the common pkg from the private npm repo
sync-common-orders:
	cd orders/ ; npm i @applinh/mcta-common

# Reinstall the common pkg from the private npm repo
sync-common-expiration:
	cd expiration/ ; npm i @applinh/mcta-common

# Reinstall the common pkg from the private npm repo
sync-common-payments:
	cd payments/ ; npm i @applinh/mcta-common