# 🚂 Railway Dashboard Deployment Guide

## Your Railway Project Details

**Project Name:** financial-projection-tool  
**Project ID:** e1a3935c-2956-4b67-85a4-2a8cbd8bf0bc  
**Service ID:** d27a6891-210c-48a8-9dfa-2bf9d7b5305e  
**Dashboard URL:** https://railway.app/project/e1a3935c-2956-4b67-85a4-2a8cbd8bf0bc

---

## 📦 Deployment Steps

### Step 1: Access Your Railway Project

1. Go to: https://railway.app/project/e1a3935c-2956-4b67-85a4-2a8cbd8bf0bc
2. You should see your project "financial-projection-tool" with a "web" service

### Step 2: Deploy from GitHub (Recommended)

#### Option A: Connect GitHub Repository

1. Click on the "web" service
2. Click "Settings" tab
3. Scroll to "Source"
4. Click "Connect Repo"
5. Authorize Railway to access your GitHub
6. Create a new repository or select existing one
7. Upload the project files to that repository
8. Railway will automatically detect and deploy

#### Option B: Deploy from Local Git

1. Install Railway CLI: `npm install -g @railway/cli`
2. Login: `railway login`
3. Navigate to project folder
4. Run: `railway up`

### Step 3: Configure Environment (Optional)

If you want to add Firebase later:

1. Go to "Variables" tab in your service
2. Add these variables:
   - `NODE_ENV` = `production`
   - `PORT` = `3000`
3. Click "Deploy" to restart with new variables

### Step 4: Generate Domain

1. Go to "Settings" tab
2. Scroll to "Domains"
3. Click "Generate Domain"
4. You'll get a URL like: `https://financial-projection-tool-production.up.railway.app`

### Step 5: Verify Deployment

1. Wait for deployment to complete (2-3 minutes)
2. Click on the generated domain URL
3. Test the application:
   - ✅ All form fields work
   - ✅ Calculate projection works
   - ✅ Charts display
   - ✅ CSV export works
   - ✅ Dark mode works

---

## 📁 Files to Upload (if using manual upload)

Upload the entire project folder containing:

```
financial-projection-tool/
├── package.json          ← Dependencies
├── package-lock.json     ← Lock file
├── vite.config.js        ← Build config
├── railway.json          ← Railway config
├── .railway.json         ← Project link
├── server/
│   └── index.js          ← Express server
├── public/
│   ├── index.html        ← Main HTML
│   ├── config.json       ← Firebase config
│   ├── manifest.json     ← PWA manifest
│   └── src/              ← JavaScript modules
└── dist/                 ← Built files (auto-generated)
```

---

## 🔧 Troubleshooting

### Build Fails

**Solution:**
- Check Railway build logs
- Ensure `package.json` has correct scripts
- Verify all dependencies are listed

### App Shows Error

**Solution:**
- This is normal if Firebase is not configured
- The app will run in offline mode
- All calculations and exports will work
- Only save/load features need Firebase

### Port Issues

**Solution:**
- Railway automatically sets PORT environment variable
- The server reads from `process.env.PORT`
- Default is 3000 if not set

---

## 🎯 What Works Without Firebase

✅ **Full Functionality:**
- All form inputs and calculations
- Financial projections (up to 50 years)
- Chart visualizations
- CSV export
- Dark mode
- Responsive design
- All GOD MODE features (analytics, recommendations)

❌ **Requires Firebase:**
- Save projection to cloud
- Load saved projections
- Delete projections
- Multi-device sync

---

## 🔥 Adding Firebase (Optional)

### Step 1: Create Firebase Project

1. Go to https://console.firebase.google.com/
2. Create new project
3. Enable Firestore Database
4. Enable Authentication (Anonymous)

### Step 2: Get Firebase Config

1. Project Settings → Your apps
2. Add web app
3. Copy the firebaseConfig object

### Step 3: Update config.json

Edit `public/config.json`:

```json
{
  "firebaseConfig": {
    "apiKey": "YOUR_API_KEY",
    "authDomain": "your-project.firebaseapp.com",
    "projectId": "your-project-id",
    "storageBucket": "your-project.appspot.com",
    "messagingSenderId": "123456789",
    "appId": "1:123456789:web:abcdef"
  },
  "appId": "financial-projection-tool",
  "initialAuthToken": ""
}
```

### Step 4: Redeploy

Push changes to GitHub or run `railway up`

---

## 📊 Monitoring

### View Logs

1. Go to your service in Railway dashboard
2. Click "Deployments" tab
3. Click on active deployment
4. View "Build Logs" and "Deploy Logs"

### Check Metrics

1. Click "Metrics" tab
2. Monitor:
   - CPU usage
   - Memory usage
   - Network traffic
   - Request count

---

## 💰 Cost Estimate

**Railway Free Tier:**
- $5 free credit per month
- Enough for ~500 hours of runtime
- Perfect for personal projects

**This App Usage:**
- Very lightweight (~50MB memory)
- Minimal CPU usage
- Should stay within free tier

---

## 🎉 Success Checklist

After deployment, verify:

- [ ] App loads without errors (offline mode notification is OK)
- [ ] Can enter all form fields
- [ ] Calculate button works
- [ ] Chart displays correctly
- [ ] CSV export downloads
- [ ] Dark mode toggles
- [ ] Responsive on mobile
- [ ] Domain is accessible publicly

---

## 📞 Need Help?

1. Check Railway build/deploy logs
2. Review this guide
3. Check main README.md
4. Railway Discord: https://discord.gg/railway

---

**Your app is ready to deploy! 🚀**

Just follow the steps above and you'll have your Financial Projection Tool live in minutes!
