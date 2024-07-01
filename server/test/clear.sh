#!/bin/bash

# Delete cronjobs
kubectl delete -f cron.yaml

# Delete services
kubectl delete -f services.yaml

# Delete deployments
kubectl delete -f deployment.yaml

# Delete persistent volumes and persistent volume claims
kubectl delete -f pv.yaml

# Delete namespaces
kubectl delete -f namespaces.yaml

echo "All resources have been deleted successfully."

