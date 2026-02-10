# Docker + OpenShift Deployment Guide

## 🎯 Quick Start

This guide will help you deploy Bharathlancers using Docker containers on OpenShift cloud platform.

---

## Prerequisites

### Required Accounts
- ✅ [Docker Hub](https://hub.docker.com/) - Free account
- ✅ [Neon](https://neon.tech/) - Serverless PostgreSQL (Free tier)
- ✅ [Red Hat OpenShift](https://developers.redhat.com/developer-sandbox) - Free sandbox
- ✅ [Gemini API](https://makersuite.google.com/app/apikey) - API key

### Required Tools
- ✅ Docker Desktop
- ✅ Git
- ✅ OpenShift CLI (`oc`)

---

## Step 1: Set Up Neon Database

1. **Create Account**: Go to [neon.tech](https://neon.tech)
2. **Create Project**: Name it `bharathlancers`
3. **Copy Connection String**:
   ```
   postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/bharathlancers
   ```
4. **Save it** - You'll need this later!

> **Note**: Currently using MongoDB. Database migration to PostgreSQL is optional for now.

---

## Step 2: Test Locally with Docker Compose

### Create Environment File
```bash
# Copy template
cp .env.docker .env

# Edit .env and add your values:
# - DATABASE_URL (your MongoDB or Neon URL)
# - JWT_SECRET (generate a random 32+ char string)
# - GEMINI_API_KEY (your Gemini API key)
```

### Build and Run
```bash
# Build images
docker-compose build

# Start containers
docker-compose up

# Access:
# Frontend: http://localhost:3000
# Backend: http://localhost:5000
```

### Test Everything
- ✅ Registration works
- ✅ Login works
- ✅ Job posting works
- ✅ Chat works
- ✅ Voice recording works

### Stop Containers
```bash
docker-compose down
```

---

## Step 3: Push to Docker Hub

### Login
```bash
docker login
# Enter your Docker Hub username and password
```

### Build Production Images
```bash
# Backend
cd backend
docker build -t yourusername/bharathlancers-backend:latest .
docker build -t yourusername/bharathlancers-backend:v1.0.0 .

# Frontend
cd ../frontend
docker build -t yourusername/bharathlancers-frontend:latest .
docker build -t yourusername/bharathlancers-frontend:v1.0.0 .
```

### Push to Docker Hub
```bash
# Backend
docker push yourusername/bharathlancers-backend:latest
docker push yourusername/bharathlancers-backend:v1.0.0

# Frontend
docker push yourusername/bharathlancers-frontend:latest
docker push yourusername/bharathlancers-frontend:v1.0.0
```

### Verify
Go to [Docker Hub](https://hub.docker.com/) and check your repositories are public!

---

## Step 4: Deploy to OpenShift

### Install OpenShift CLI

**Windows**:
```bash
choco install openshift-cli
```

**Or download**: [OpenShift CLI](https://mirror.openshift.com/pub/openshift-v4/clients/ocp/)

### Get Free OpenShift Account
1. Go to [Red Hat Developer Sandbox](https://developers.redhat.com/developer-sandbox)
2. Sign up (free, no credit card)
3. Access your sandbox

### Login to OpenShift
1. Go to OpenShift web console
2. Click your name → "Copy login command"
3. Get token and run:
```bash
oc login --token=YOUR_TOKEN --server=https://api.sandbox.openshift.com:6443
```

### Create Project
```bash
oc new-project bharathlancers
```

### Update Deployment Files
Edit `openshift/backend-deployment.yaml` and `openshift/frontend-deployment.yaml`:
- Replace `yourusername` with your Docker Hub username

### Create Secrets
```bash
oc create secret generic bharathlancers-secrets \
  --from-literal=database-url='your-mongodb-or-neon-url' \
  --from-literal=jwt-secret='your-super-secret-jwt-key-min-32-chars' \
  --from-literal=gemini-api-key='your-gemini-api-key'
```

### Deploy Backend
```bash
oc apply -f openshift/backend-deployment.yaml
```

### Deploy Frontend
```bash
oc apply -f openshift/frontend-deployment.yaml
```

### Enable Auto-Scaling (Impressive!)
```bash
oc apply -f openshift/hpa.yaml
```

### Get Your URLs
```bash
oc get routes

# You'll see:
# bharathlancers-backend-bharathlancers.apps.sandbox.openshift.com
# bharathlancers-frontend-bharathlancers.apps.sandbox.openshift.com
```

### Update Frontend URL
Update `openshift/backend-deployment.yaml` with your frontend URL, then:
```bash
oc apply -f openshift/backend-deployment.yaml
```

---

## Step 5: Verify Deployment

### Check Pods
```bash
oc get pods

# Should show:
# bharathlancers-backend-xxxxx   1/1   Running
# bharathlancers-frontend-xxxxx  1/1   Running
```

### Check Logs
```bash
# Backend
oc logs -f deployment/bharathlancers-backend

# Frontend
oc logs -f deployment/bharathlancers-frontend
```

### Test Application
Visit your frontend URL and test all features!

---

## Hackathon Demo Points

### Show Judges:
1. **Docker Hub**: "Our images are publicly available on Docker Hub"
2. **OpenShift Console**: Show running pods, auto-scaling
3. **Live Application**: Demonstrate features
4. **Monitoring**: Show logs, metrics, health checks
5. **Scalability**: Explain auto-scaling configuration

### Technical Highlights:
- ✅ **Containerized** with Docker
- ✅ **Multi-stage builds** for optimized images
- ✅ **Kubernetes deployment** on OpenShift
- ✅ **Auto-scaling** based on CPU/memory
- ✅ **Health checks** for high availability
- ✅ **Zero-downtime** rolling updates
- ✅ **Production-ready** configuration

---

## Useful Commands

### View Resources
```bash
oc get all                    # All resources
oc get pods                   # Running pods
oc get routes                 # URLs
oc get hpa                    # Auto-scaling status
```

### Debugging
```bash
oc describe pod POD_NAME      # Pod details
oc logs -f POD_NAME           # Live logs
oc rsh POD_NAME               # Shell access
```

### Updates
```bash
# After pushing new Docker image
oc rollout restart deployment/bharathlancers-backend
oc rollout restart deployment/bharathlancers-frontend
```

---

## Troubleshooting

### Pods Not Starting
```bash
# Check events
oc get events --sort-by='.lastTimestamp'

# Check pod details
oc describe pod POD_NAME
```

### Image Pull Errors
- Verify Docker Hub images are **public**
- Check image names in deployment YAML
- Test: `docker pull yourusername/bharathlancers-backend:latest`

### Database Connection
- Verify DATABASE_URL secret
- Check database is accessible
- Test from pod: `oc rsh POD_NAME`

---

## Cost Breakdown

### Free Tier (Perfect for Hackathon)
- ✅ Docker Hub: Free (public repos)
- ✅ Neon: Free (3GB storage)
- ✅ OpenShift Sandbox: Free (60 days)
- **Total**: $0

### After Hackathon
- OpenShift: $50/month (or use other platforms)
- Neon: $9/month (or use free tier)

---

## Next Steps

1. ✅ Test locally with Docker Compose
2. ✅ Push images to Docker Hub
3. ✅ Deploy to OpenShift
4. ✅ Test all features
5. ✅ Prepare demo for judges
6. ✅ Win the hackathon! 🏆

**Need help? Check `openshift/README.md` for detailed commands!**
