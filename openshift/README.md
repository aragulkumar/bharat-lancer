# OpenShift Deployment Commands

## Prerequisites
1. Install OpenShift CLI: https://mirror.openshift.com/pub/openshift-v4/clients/ocp/
2. Get free OpenShift account: https://developers.redhat.com/developer-sandbox
3. Have Docker Hub account with published images

## Step 1: Login to OpenShift
```bash
# Get your login command from OpenShift web console
oc login --token=YOUR_TOKEN --server=https://api.sandbox.openshift.com:6443
```

## Step 2: Create Project
```bash
# Create new project
oc new-project bharathlancers

# Verify you're in the right project
oc project bharathlancers
```

## Step 3: Create Secrets
```bash
# Create secrets for sensitive data
oc create secret generic bharathlancers-secrets \
  --from-literal=database-url='postgresql://user:pass@neon.tech/bharathlancers' \
  --from-literal=jwt-secret='your-super-secret-jwt-key-min-32-chars' \
  --from-literal=gemini-api-key='your-gemini-api-key'

# Verify secret was created
oc get secrets
```

## Step 4: Deploy Backend
```bash
# Apply backend deployment
oc apply -f openshift/backend-deployment.yaml

# Check deployment status
oc get deployments
oc get pods

# View logs
oc logs -f deployment/bharathlancers-backend
```

## Step 5: Deploy Frontend
```bash
# Apply frontend deployment
oc apply -f openshift/frontend-deployment.yaml

# Check deployment status
oc get deployments
oc get pods
```

## Step 6: Enable Auto-Scaling (Optional but Impressive!)
```bash
# Apply HPA configuration
oc apply -f openshift/hpa.yaml

# Check HPA status
oc get hpa
```

## Step 7: Get Your URLs
```bash
# Get all routes
oc get routes

# You'll see URLs like:
# bharathlancers-backend-bharathlancers.apps.sandbox.openshift.com
# bharathlancers-frontend-bharathlancers.apps.sandbox.openshift.com
```

## Useful Commands

### View Resources
```bash
# All resources
oc get all

# Pods
oc get pods

# Services
oc get svc

# Routes (URLs)
oc get routes

# Deployments
oc get deployments
```

### View Logs
```bash
# Backend logs
oc logs -f deployment/bharathlancers-backend

# Frontend logs
oc logs -f deployment/bharathlancers-frontend

# Specific pod logs
oc logs -f pod/bharathlancers-backend-xxxxx
```

### Debugging
```bash
# Describe pod (see events and errors)
oc describe pod bharathlancers-backend-xxxxx

# Get pod shell access
oc rsh bharathlancers-backend-xxxxx

# Port forward for local testing
oc port-forward deployment/bharathlancers-backend 5000:5000
```

### Update Deployment
```bash
# After pushing new Docker image
oc rollout restart deployment/bharathlancers-backend
oc rollout restart deployment/bharathlancers-frontend

# Check rollout status
oc rollout status deployment/bharathlancers-backend
```

### Scale Manually
```bash
# Scale backend to 3 replicas
oc scale deployment bharathlancers-backend --replicas=3

# Scale frontend to 2 replicas
oc scale deployment bharathlancers-frontend --replicas=2
```

### Delete Everything
```bash
# Delete all resources
oc delete -f openshift/

# Or delete entire project
oc delete project bharathlancers
```

## Monitoring

### OpenShift Web Console
1. Go to https://console.redhat.com/openshift/sandbox
2. Navigate to your project
3. View:
   - Topology (visual view)
   - Pods (running instances)
   - Routes (URLs)
   - Metrics (CPU, Memory)
   - Logs

### Check Health
```bash
# Backend health
curl https://bharathlancers-backend-bharathlancers.apps.sandbox.openshift.com/api/health

# Frontend
curl https://bharathlancers-frontend-bharathlancers.apps.sandbox.openshift.com
```

## Troubleshooting

### Pods Not Starting
```bash
# Check events
oc get events --sort-by='.lastTimestamp'

# Describe pod
oc describe pod bharathlancers-backend-xxxxx

# Check logs
oc logs bharathlancers-backend-xxxxx
```

### Image Pull Errors
- Verify Docker Hub image is public
- Check image name in deployment YAML
- Ensure image exists: `docker pull yourusername/bharathlancers-backend:latest`

### Database Connection Issues
- Verify DATABASE_URL secret is correct
- Check Neon database is accessible
- Test connection from pod: `oc rsh pod-name`

## For Hackathon Demo

### Show These Commands:
```bash
# Show running pods
oc get pods

# Show auto-scaling
oc get hpa

# Show routes (URLs)
oc get routes

# Show logs (real-time)
oc logs -f deployment/bharathlancers-backend --tail=20
```

### Impressive Points to Mention:
1. "We use OpenShift for enterprise-grade Kubernetes deployment"
2. "Auto-scaling based on CPU/memory usage"
3. "Zero-downtime rolling updates"
4. "Health checks ensure high availability"
5. "Containerized for consistent deployments"
