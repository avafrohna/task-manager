# Task Manager React App

This project was bootstrapped with [Create React App].

## Available Scripts

In the project directory, you can run:

`npm start`

### Minikube
    minikube ip
    minikube start
    kubectl get nodes
    eval $(minikube docker-env)
    docker build -t myapp_backend:latest -f Dockerfile.backend .
    docker build -t myapp_frontend:latest -f Dockerfile.frontend .
    kubectl apply -f mysql-pvc.yaml
    kubectl get pvc
    kubectl create configmap mysql-initdb --from-file=data-tables.sql
    kubectl apply -f db-deployment.yaml
    kubectl apply -f backend-deployment.yaml
    kubectl apply -f frontend-deployment.yaml
    kubectl get pods
    http://localhost:30002

    kubectl delete deployment –all
    kubectl delete pods -l app=backend

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
