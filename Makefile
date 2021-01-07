minikube-clean:
	minikube delete
	minikube start
	minikube addons enable ingress

start-dev:
	$(MAKE) minikube-clean	
	kubectl expose deployment ingress-nginx-controller --target-port=80 --type=NodePort -n kube-system
	kubectl create secret generic jwt-secret --from-literal=JWT_KEY=jwthash123
	skaffold dev

pub-common:
	@echo "Publish and push common package changes"
	cd common/
	npm run pub

sync-common-auth:
	cd auth/
	npm i @react-node-microservices-course/common