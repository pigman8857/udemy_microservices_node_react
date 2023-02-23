#### Course
[microservices-with-node-js-and-react](https://www.udemy.com/course/microservices-with-node-js-and-react)

#### Set up minikube

```
minikube start

```

#### change docker env to minikube 

```
eval $(minikube docker-env)
```

after that check images in mikikube env by `docker images`

#### push your latest POST service version to docker hub

```
docker push ohsva/blog-posts
```


#### apply cluster deployment of POST service 

```
    kubectl apply -f ./infra/k8s/posts-depl.yaml

```

#### apply by always get latest version of POST service from docker hub 

`kubectl rollout` is used to update kubernetes object


```
kubectl rollout restart deployment [deployment name]

```

Ex:

```
kubectl rollout restart deployment post-depl
```

#### Apply Node port service

```
kubectl apply -f infra/k8s/posts-srv.yaml
```

#### Get minikuibe IP

This port is for development purpose only
```
minikube ip
```

#### kubernestes Describe service 

```
kubectl describe service posts-srv
```