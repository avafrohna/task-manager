# Task Manager React App

This project was bootstrapped with [Create React App].

## Available Scripts

In the project directory, you can run:

`npm start`

### Minikube
    minikube start
    minikube addons enable ingress
    eval $(minikube docker-env)
    kubectl apply -f mysql-pvc.yaml
    kubectl apply -f mysql-initdb-configmap.yaml
    kubectl apply -f db-deployment.yaml
    kubectl get pods -l app=db --watch
    
    docker build -t myapp_backend -f Dockerfile.backend .
    docker build -t myapp_frontend -f Dockerfile.frontend .
    kubectl apply -f backend-deployment.yaml
    kubectl apply -f frontend-deployment.yaml
    kubectl apply -f ingress.yaml

    minikube tunnel
    minikube ip

    kubectl delete deployment backend frontend
    kubectl delete service backend frontend
    kubectl delete ingress app-ingress
    kubectl get pods
    kubectl get services

    http://127.0.0.1


### GCP
    cloud-computing-433102
    NAME         TYPE           CLUSTER-IP      EXTERNAL-IP     PORT(S)          AGE
    backend      LoadBalancer   34.118.239.79   34.42.30.190    4000:32194/TCP   24m
    frontend     LoadBalancer   34.118.238.28   34.30.173.133   3000:31593/TCP   11m

    docker build -t gcr.io/cloud-computing-433102/myapp_frontend:latest -f Dockerfile.frontend .
    docker push gcr.io/cloud-computing-433102/myapp_frontend:latest

    docker build -t gcr.io/cloud-computing-433102/myapp_backend:latest -f Dockerfile.backend .
    docker push gcr.io/cloud-computing-433102/myapp_backend:latest

    kubectl apply -f frontend-deployment.yaml
    kubectl apply -f backend-deployment.yaml
