# Deployment Guide

## Render Deployment

See detailed guide: [Render Deployment Guide](../.gemini/antigravity/brain/71a60638-8c20-4b0c-b737-d8d317120b97/render_deployment_guide.md)

### Quick Start

1. **Backend**: Deploy as Node.js web service
2. **Frontend**: Deploy as static site
3. **Database**: Use MongoDB Atlas (free tier)

### Environment Variables Needed

**Backend**:
```
NODE_ENV=production
MONGODB_URI=your-mongodb-atlas-uri
JWT_SECRET=your-secret-key
GEMINI_API_KEY=your-gemini-key
FRONTEND_URL=https://your-frontend-url.onrender.com
```

**Frontend**:
```
VITE_API_URL=https://your-backend-url.onrender.com/api
```

### Deployment Commands

**Backend**:
- Build: `npm install`
- Start: `npm start`
- Root: `backend/`

**Frontend**:
- Build: `npm install && npm run build`
- Publish: `dist/`
- Root: `frontend/`

---

For detailed instructions, troubleshooting, and best practices, see the complete deployment guide.
