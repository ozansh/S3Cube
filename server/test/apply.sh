#!/bin/bash

# Apply namespaces
kubectl apply -f namespaces.yaml

# Apply persistent volumes and persistent volume claims
kubectl apply -f pv.yaml

# Apply deployments
kubectl apply -f deployment.yaml


# Apply services
kubectl apply -f services.yaml

# Apply cronjobs
kubectl apply -f cron.yaml

echo "All resources have been applied successfully."

