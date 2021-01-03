# Kubernetes

## Create and use (generic) secrets

**Create a secret:**

`kubectl create secret generic jwt-secret --from-literal=JWT_KEY=jwthash123`

Value pair => "JWT_KEY":"jwthash123"

**Assigning it to pod:**

... as an env variable, but directly picked from kubectl secrets.

```YAML
env:
    - name: JWT_KEY
    valueFrom:
        secretKeyRef:
            name: jwt-secret
            key: JWT_KEY
```