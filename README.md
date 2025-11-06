# 💰 Financial Projection Tool - GOD MODE Edition

A professional, enterprise-level financial projection calculator with advanced analytics, multiple export formats, auto-save functionality, and Firebase integration.

## 🚀 Features

### Core Functionality
- ✅ **Financial Projections** - Calculate long-term financial projections with investment returns and inflation
- ✅ **Multiple Spending Modes** - Single total amount or itemized breakdown
- ✅ **Dynamic Adjustments** - Schedule spending changes, income changes, and lump sum events
- ✅ **Real-time Calculations** - Instant projection updates with comprehensive monthly breakdown

### GOD MODE Features
- 🎯 **Advanced Analytics**
  - Retirement readiness score
  - Risk analysis and volatility metrics
  - Break-even point calculation
  - Cash flow pattern analysis
  - Financial milestones tracking
  - Personalized recommendations

- 📊 **Data Visualization**
  - Interactive Chart.js charts
  - Multiple data series (capital, income, spending)
  - Responsive and theme-aware
  - Export charts as images

- 💾 **Data Management**
  - Auto-save drafts (prevents data loss)
  - Save/load/delete projections
  - Real-time Firebase sync
  - Import/export capabilities

- 📥 **Multiple Export Formats**
  - CSV (detailed monthly data)
  - Excel (formatted spreadsheet)
  - JSON (complete data structure)
  - PDF (professional report with analytics)

- 🎨 **Professional UI/UX**
  - Dark mode support
  - Responsive design (mobile-friendly)
  - Loading states and animations
  - Toast notifications
  - Modal dialogs
  - Accessibility (WCAG 2.1 AA)

- 🔒 **Security & Performance**
  - Firebase Authentication
  - Secure environment variables
  - Input validation
  - Error boundaries
  - Debounced operations
  - Optimized rendering

## 📋 Prerequisites

- Node.js 18+ and npm 9+
- Firebase project with Firestore and Authentication enabled
- Railway.app account (for deployment)
- GitHub account (for version control)

## 🛠️ Installation

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd financial-projection-tool
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

Edit `.env` and add your Firebase configuration:

```env
FIREBASE_CONFIG={"apiKey":"...","authDomain":"...","projectId":"...","storageBucket":"...","messagingSenderId":"...","appId":"..."}
APP_ID=financial-projection-tool
NODE_ENV=development
PORT=3000
```

### 4. Run development server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## 🏗️ Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist/` directory.

## 🚀 Deployment

### Deploy to Railway.app

1. **Install Railway CLI** (if not already installed):
```bash
npm install -g @railway/cli
```

2. **Login to Railway**:
```bash
railway login
```

3. **Initialize project**:
```bash
railway init
```

4. **Add environment variables**:
```bash
railway variables set FIREBASE_CONFIG='{"apiKey":"...","authDomain":"..."}'
railway variables set APP_ID=financial-projection-tool
railway variables set NODE_ENV=production
```

5. **Deploy**:
```bash
railway up
```

6. **Get deployment URL**:
```bash
railway domain
```

### Deploy to GitHub

1. **Initialize Git repository**:
```bash
git init
git add .
git commit -m "Initial commit: Financial Projection Tool GOD MODE"
```

2. **Create GitHub repository** and push:
```bash
git remote add origin <your-github-repo-url>
git branch -M main
git push -u origin main
```

## 📖 Usage Guide

### Basic Projection

1. **Set Core Parameters**
   - Initial Capital (MYR)
   - Current Age
   - Investment Return Rate (%)
   - Inflation Rate (%)
   - Start Date

2. **Configure Income & Spending**
   - Set initial monthly income
   - Choose spending mode (single or itemized)
   - Add spending categories if using itemized mode

3. **Add Dynamic Events** (Optional)
   - Spending adjustments (% changes)
   - Income changes (new income amounts)
   - Lump sum events (bonuses, inheritance, etc.)

4. **Calculate Projection**
   - Click "Calculate Financial Projection"
   - View results, charts, and analytics

5. **Save & Export**
   - Save projection to Firebase
   - Export to CSV, Excel, JSON, or PDF
   - Download chart as image

### Advanced Features

#### Auto-Save
- Drafts are automatically saved every 2 seconds
- Recover unsaved work on page reload
- Auto-save indicator shows save status

#### Advanced Analytics
- **Retirement Readiness**: Score out of 100 with recommendations
- **Risk Analysis**: Volatility and capital depletion risk
- **Break-Even Point**: When capital returns to initial amount
- **Milestones**: First million, peak capital, retirement age
- **Recommendations**: Personalized financial advice

#### Dark Mode
- Toggle with sun/moon icon in header
- Preference saved to localStorage
- Charts automatically adjust colors

## 🏗️ Project Structure

```
financial-projection-tool/
├── public/                      # Static files
│   ├── assets/
│   │   ├── styles/
│   │   │   └── main.css        # Custom styles
│   │   └── images/             # Icons and images
│   ├── index.html              # Main HTML file
│   └── manifest.json           # PWA manifest
├── src/
│   └── js/
│       ├── config/
│       │   └── firebase.js     # Firebase configuration
│       ├── modules/
│       │   ├── auth.js         # Authentication
│       │   ├── database.js     # Firestore operations
│       │   ├── calculator.js   # Projection calculations
│       │   ├── chart.js        # Chart rendering
│       │   ├── form.js         # Form management
│       │   ├── ui.js           # UI utilities
│       │   ├── analytics.js    # Advanced analytics
│       │   ├── autosave.js     # Auto-save functionality
│       │   └── export.js       # Export functionality
│       ├── utils/
│       │   ├── validation.js   # Input validation
│       │   └── helpers.js      # Helper functions
│       └── main.js             # Application entry point
├── server/
│   └── index.js                # Express server
├── .env.example                # Environment variables template
├── .gitignore                  # Git ignore rules
├── package.json                # Dependencies
├── vite.config.js              # Vite configuration
├── railway.json                # Railway deployment config
└── README.md                   # This file
```

## 🔧 Configuration

### Firebase Setup

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable **Authentication** (Anonymous and/or Email/Password)
3. Enable **Firestore Database**
4. Create a web app and copy the configuration
5. Add configuration to `.env` file

### Firestore Security Rules

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

## 🧪 Testing

### Local Testing

```bash
# Run development server
npm run dev

# Build and preview production build
npm run build
npm run preview
```

### Test Features

1. ✅ Create new projection
2. ✅ Calculate projection with various parameters
3. ✅ Save projection to Firebase
4. ✅ Load saved projection
5. ✅ Delete projection
6. ✅ Export to CSV, Excel, JSON, PDF
7. ✅ Toggle dark mode
8. ✅ Test auto-save (modify form and wait 2 seconds)
9. ✅ Test responsive design (resize browser)
10. ✅ Test advanced analytics

## 📊 Technology Stack

- **Frontend**: Vanilla JavaScript (ES6 Modules)
- **Styling**: Tailwind CSS
- **Charts**: Chart.js
- **Backend**: Firebase (Authentication + Firestore)
- **Server**: Express.js (for Railway deployment)
- **Build Tool**: Vite
- **Hosting**: Railway.app

## 🎯 Performance Optimizations

- Debounced auto-save (reduces Firebase writes)
- Lazy chart rendering (only when results available)
- Sampled data display (for large datasets)
- Optimized DOM updates
- Minified production build
- Compressed assets

## 🔐 Security Features

- Firebase Authentication
- Environment variable protection
- Input validation and sanitization
- CSP headers (Helmet.js)
- HTTPS enforcement (Railway)
- No sensitive data in client code

## 🐛 Troubleshooting

### Firebase Connection Issues
- Verify Firebase configuration in `.env`
- Check Firebase project settings
- Ensure Firestore and Authentication are enabled

### Build Errors
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Clear build cache: `rm -rf dist`
- Check Node.js version: `node --version` (should be 18+)

### Deployment Issues
- Verify environment variables in Railway dashboard
- Check build logs in Railway
- Ensure PORT environment variable is set

## 📝 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues or questions, please open an issue on GitHub.

---

**Built with ❤️ using Firebase, Chart.js, Tailwind CSS, and Vite**

**GOD MODE Edition** - Professional, Enterprise-Ready Financial Projection Tool
