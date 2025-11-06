# 🚀 Deployment Guide

## Prerequisites Checklist

Before deploying, ensure you have:

- ✅ Firebase project created
- ✅ Firestore Database enabled
- ✅ Firebase Authentication enabled (Anonymous or Email/Password)
- ✅ Railway.app account
- ✅ GitHub account
- ✅ Git installed locally

## Step 1: Firebase Setup

### 1.1 Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name (e.g., "financial-projection-tool")
4. Follow the setup wizard

### 1.2 Enable Firestore

1. In Firebase Console, go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in production mode"
4. Select a location
5. Click "Enable"

### 1.3 Set Firestore Security Rules

Go to "Firestore Database" > "Rules" and paste:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /projections/{projection} {
      allow read, write: if request.auth != null && 
                          request.auth.uid == resource.data.userId;
      allow create: if request.auth != null;
    }
  }
}
```

Click "Publish"

### 1.4 Enable Authentication

1. Go to "Authentication" > "Sign-in method"
2. Enable "Anonymous" provider
3. (Optional) Enable "Email/Password" provider
4. Click "Save"

### 1.5 Get Firebase Configuration

1. Go to Project Settings (gear icon)
2. Scroll to "Your apps"
3. Click "Web" icon (</>) to add a web app
4. Register app with a nickname
5. Copy the firebaseConfig object

## Step 2: Configure Application

### 2.1 Update config.json

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

### 2.2 Test Locally

```bash
npm install
npm run dev
```

Open http://localhost:3000 and verify:
- ✅ Application loads
- ✅ Can create projection
- ✅ Can calculate projection
- ✅ Can save projection (Firebase)
- ✅ Can load projection
- ✅ Can export to CSV/PDF

## Step 3: Deploy to Railway.app

### 3.1 Install Railway CLI

```bash
npm install -g @railway/cli
```

### 3.2 Login to Railway

```bash
railway login
```

This will open a browser for authentication.

### 3.3 Initialize Project

```bash
railway init
```

- Choose "Create new project"
- Enter project name: "financial-projection-tool"

### 3.4 Set Environment Variables

```bash
railway variables set NODE_ENV=production
railway variables set PORT=3000
```

### 3.5 Deploy

```bash
railway up
```

Wait for deployment to complete.

### 3.6 Get Deployment URL

```bash
railway domain
```

This will generate a public URL like: `https://your-app.up.railway.app`

### 3.7 Add Custom Domain (Optional)

In Railway dashboard:
1. Go to your project
2. Click "Settings"
3. Scroll to "Domains"
4. Click "Generate Domain" or add custom domain

## Step 4: Deploy to GitHub

### 4.1 Create GitHub Repository

1. Go to [GitHub](https://github.com)
2. Click "New repository"
3. Name: "financial-projection-tool"
4. Choose public or private
5. Click "Create repository"

### 4.2 Initialize Git and Push

```bash
git init
git add .
git commit -m "Initial commit: Financial Projection Tool GOD MODE"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/financial-projection-tool.git
git push -u origin main
```

### 4.3 Connect Railway to GitHub (Optional)

For automatic deployments:

1. In Railway dashboard, go to your project
2. Click "Settings"
3. Connect GitHub repository
4. Enable "Auto Deploy"

Now every push to `main` branch will trigger automatic deployment!

## Step 5: Verify Deployment

### 5.1 Test Production Site

Visit your Railway URL and test:

- ✅ Application loads
- ✅ Firebase connection works
- ✅ Can save/load projections
- ✅ All calculations work
- ✅ Export functions work
- ✅ Dark mode works
- ✅ Responsive on mobile

### 5.2 Monitor Logs

```bash
railway logs
```

Check for any errors or warnings.

## Troubleshooting

### Issue: Firebase Connection Failed

**Solution:**
- Verify Firebase config in `config.json`
- Check Firebase project is active
- Ensure Firestore and Auth are enabled

### Issue: Build Fails on Railway

**Solution:**
- Check Railway build logs
- Verify `package.json` scripts
- Ensure all dependencies are listed

### Issue: Environment Variables Not Working

**Solution:**
- Use Railway dashboard to set variables
- Restart the deployment
- Check variable names match code

### Issue: 404 on Routes

**Solution:**
- This is a single-page app
- Ensure server serves `index.html` for all routes
- Check `server/index.js` configuration

## Maintenance

### Update Application

```bash
# Make changes
git add .
git commit -m "Update: description of changes"
git push

# If connected to Railway, it will auto-deploy
# Otherwise, manually deploy:
railway up
```

### Monitor Usage

- Check Firebase Console for usage stats
- Monitor Railway dashboard for performance
- Review logs regularly

### Backup Data

Firestore data can be exported:
1. Go to Firebase Console
2. Firestore Database
3. Click "Import/Export"
4. Export to Cloud Storage

## Security Checklist

- ✅ Firestore security rules configured
- ✅ Firebase API key restricted (optional)
- ✅ HTTPS enabled (automatic on Railway)
- ✅ Environment variables secured
- ✅ No sensitive data in client code

## Performance Optimization

- ✅ Build minified (Vite + Terser)
- ✅ Assets compressed
- ✅ Chart.js loaded from CDN
- ✅ Tailwind CSS from CDN
- ✅ Debounced operations

## Support

For issues:
1. Check this deployment guide
2. Review README.md
3. Check Railway logs
4. Review Firebase Console

---

**Deployment Complete! 🎉**

Your Financial Projection Tool GOD MODE Edition is now live!
