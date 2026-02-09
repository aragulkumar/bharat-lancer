# MongoDB Setup Guide for Bharat Lancer

You have **two options** to set up MongoDB:

---

## Option 1: Local MongoDB (Easiest for Development)

### Step 1: Install MongoDB Community Edition

**For Windows**:
1. Download MongoDB from: https://www.mongodb.com/try/download/community
2. Choose "Windows" and "msi" installer
3. Run the installer
4. Choose "Complete" installation
5. **Important**: Check "Install MongoDB as a Service"
6. Click "Install"

### Step 2: Verify Installation

Open PowerShell and run:
```powershell
mongod --version
```

You should see the MongoDB version.

### Step 3: Start MongoDB Service

MongoDB should start automatically. If not:
```powershell
net start MongoDB
```

### Step 4: Update .env File

Your `.env` file should already have:
```
MONGODB_URI=mongodb://localhost:27017/bharat-lancer
```

This is the **default** and will work with local MongoDB!

### Step 5: Test Connection

```bash
cd backend
npm start
```

You should see: `✅ MongoDB Connected Successfully`

---

## Option 2: MongoDB Atlas (Cloud - Free Tier)

If you don't want to install MongoDB locally, use the free cloud version:

### Step 1: Create Account

1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Sign up with email or Google
3. Choose **FREE** tier (M0 Sandbox)

### Step 2: Create Cluster

1. Click "Build a Database"
2. Choose **FREE** (M0) tier
3. Select a cloud provider and region (choose closest to you)
4. Click "Create Cluster"
5. Wait 3-5 minutes for cluster to be created

### Step 3: Create Database User

1. Click "Database Access" in left sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Username: `bharatlancer`
5. Password: Create a strong password (save it!)
6. Database User Privileges: "Read and write to any database"
7. Click "Add User"

### Step 4: Whitelist Your IP

1. Click "Network Access" in left sidebar
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (for development)
4. Click "Confirm"

### Step 5: Get Connection String

1. Click "Database" in left sidebar
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string (looks like):
   ```
   mongodb+srv://bharatlancer:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

### Step 6: Update .env File

Edit `backend/.env`:
```
MONGODB_URI=mongodb+srv://bharatlancer:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/bharat-lancer?retryWrites=true&w=majority
```

**Replace**:
- `YOUR_PASSWORD` with the password you created
- `cluster0.xxxxx` with your actual cluster address
- Added `/bharat-lancer` before the `?` to specify database name

### Step 7: Test Connection

```bash
cd backend
npm start
```

You should see: `✅ MongoDB Connected Successfully`

---

## Troubleshooting

### Error: "MongoNetworkError"
- **Local**: Make sure MongoDB service is running (`net start MongoDB`)
- **Atlas**: Check your IP is whitelisted in Network Access

### Error: "Authentication failed"
- **Atlas**: Double-check username and password in connection string
- Make sure password doesn't have special characters (or URL-encode them)

### Error: "Connection timeout"
- **Local**: MongoDB might not be installed or running
- **Atlas**: Check your internet connection

---

## Recommended: Local MongoDB for Development

For this project, I recommend **Option 1 (Local MongoDB)** because:
- ✅ Faster (no network latency)
- ✅ Works offline
- ✅ No account needed
- ✅ Free forever
- ✅ Good for learning

Use **Option 2 (Atlas)** if:
- You can't install software on your computer
- You want to deploy and share the app
- You're working from multiple computers

---

## Current Status

Your `.env` file is already configured for **Local MongoDB**:
```
MONGODB_URI=mongodb://localhost:27017/bharat-lancer
```

**Next Steps**:
1. Install MongoDB Community Edition (Option 1)
2. Start the MongoDB service
3. Run `npm start` in the backend folder
4. You should see `✅ MongoDB Connected Successfully`

That's it! 🚀
