# Firebase Setup Guide for FarmasiKu

This guide will walk you through setting up Firebase for your FarmasiKu application.

## Table of Contents
1. [Create Firebase Project](#1-create-firebase-project)
2. [Configure Firebase](#2-configure-firebase)
3. [Set Up Firestore Database](#3-set-up-firestore-database)
4. [Configure Environment Variables](#4-configure-environment-variables)
5. [Database Structure](#5-database-structure)
6. [Testing the Integration](#6-testing-the-integration)

---

## 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or **"Create a project"**
3. Enter your project name (e.g., "FarmasiKu")
4. (Optional) Enable Google Analytics
5. Click **"Create project"**

---

## 2. Configure Firebase

### Add Web App to Firebase Project

1. In your Firebase project, click the **Web icon** (`</>`) to add a web app
2. Register your app with a nickname (e.g., "FarmasiKu Web")
3. ✅ Check **"Also set up Firebase Hosting"** (optional)
4. Click **"Register app"**
5. You'll see your Firebase configuration object - **SAVE THIS!**

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123",
  measurementId: "G-XXXXXXXXXX"
};
```

---

## 3. Set Up Firestore Database

### Create Firestore Database

1. In Firebase Console, go to **"Build" → "Firestore Database"**
2. Click **"Create database"**
3. Choose **"Start in test mode"** (for development)
   - ⚠️ **Note:** Change to production rules before deploying!
4. Select your preferred location (e.g., `asia-southeast1` for Singapore)
5. Click **"Enable"**

### Configure Security Rules (Important!)

Go to the **"Rules"** tab in Firestore and update the rules:

#### For Development (Test Mode):
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.time < timestamp.date(2024, 12, 31);
    }
  }
}
```

#### For Production (Recommended):
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // User sessions - anyone can create, only owner can read/update
    match /user_sessions/{sessionId} {
      allow create: if true;
      allow read, update: if true; // Adjust based on your auth setup
    }
    
    // Orders - anyone can create, only owner can read
    match /orders/{orderId} {
      allow create: if true;
      allow read: if true; // You may want to restrict this
      allow update: if false; // Only admin should update orders
    }
    
    // Symptom assessments - anyone can create
    match /symptom_assessments/{assessmentId} {
      allow create: if true;
      allow read: if false; // Only for analytics/admin
    }
    
    // Medications - read only for users
    match /medications/{medicationId} {
      allow read: if true;
      allow write: if false; // Only admin can modify
    }
  }
}
```

---

## 4. Configure Environment Variables

### Step 1: Update `.env` file

Open the `.env` file in your project root and fill in your Firebase credentials:

```bash
# Firebase Configuration
VITE_FIREBASE_API_KEY=AIza...your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

### Step 2: Verify `.gitignore`

Make sure `.env` is in your `.gitignore` file to prevent committing sensitive data:

```
# Environment files
.env
.env.local
.env.production
```

---

## 5. Database Structure

Your FarmasiKu app will use the following Firestore collections:

### Collections Overview

#### 📋 `user_sessions`
Tracks user interaction sessions throughout the app flow.

**Document Structure:**
```javascript
{
  startedAt: "2024-11-08T10:30:00Z",
  userAgent: "Mozilla/5.0...",
  platform: "Win32",
  userAge: 25,
  selectedBodyPart: "Head",
  bodyPartSelectedAt: "2024-11-08T10:31:00Z",
  selectedSymptoms: ["Headache", "Fever"],
  symptomAssessments: {
    "Headache": { /* assessment data */ }
  },
  isMoreSevere: false,
  confirmedAt: "2024-11-08T10:35:00Z",
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

#### 🛒 `orders`
Stores customer orders with medications and payment info.

**Document Structure:**
```javascript
{
  sessionId: "session_doc_id",
  userAge: 25,
  selectedBodyPart: "Head",
  symptoms: ["Headache", "Fever"],
  symptomAssessments: { /* ... */ },
  medications: [
    { name: "Paracetamol", price: 8.90, usage: { /* ... */ } }
  ],
  customerInfo: {
    name: "John Doe",
    email: "john@example.com",
    phone: "+60123456789",
    address: "123 Main St, KL"
  },
  paymentMethod: "card",
  totalAmount: 8.90,
  status: "pending", // pending, confirmed, processing, shipped, delivered, cancelled
  orderDate: "2024-11-08T10:40:00Z",
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

#### 💊 `symptom_assessments`
Analytics data for symptom assessments.

**Document Structure:**
```javascript
{
  sessionId: "session_doc_id",
  userAge: 25,
  bodyPart: "Head",
  symptom: "Headache",
  assessment: {
    symptom: "Headache",
    duration: "2-3 days",
    severity: "moderate",
    // ... other assessment fields
  },
  timestamp: "2024-11-08T10:32:00Z",
  createdAt: Timestamp
}
```

#### 💊 `medications` (Optional - for future use)
Medication catalog stored in Firebase instead of static data.

**Document Structure:**
```javascript
{
  name: "Paracetamol Tablets",
  price: 8.90,
  category: "Pain Relief",
  symptoms: ["Headache", "Fever"],
  usage: {
    method: "oral",
    methodLabel: "Oral (Take by mouth)",
    dosage: "500-1000mg (1-2 tablets)",
    frequency: "Every 4-6 hours",
    maxDosage: "4000mg (8 tablets) per day",
    instructions: "Take with water...",
    duration: "3-5 days or as needed",
    icon: "💊"
  },
  inStock: true,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

---

## 6. Testing the Integration

### Step 1: Start the Development Server

```bash
npm run dev
```

### Step 2: Test the Flow

1. **Enter Age** → Check browser console for "User session created: [ID]"
2. **Select Body Part** → Session should update
3. **Select Symptoms** → Symptom assessments should be saved
4. **Complete Order** → Order should be created in Firestore

### Step 3: Verify in Firebase Console

1. Go to **Firestore Database** in Firebase Console
2. Check the collections:
   - `user_sessions` - Should see new session documents
   - `orders` - Should see orders after payment
   - `symptom_assessments` - Should see assessment data

### Check Browser Console

Look for these logs:
```
User session created: [session_id]
Order created: [order_id]
```

---

## 7. Firebase Functions (Optional - Advanced)

For production, you may want to add Firebase Cloud Functions for:

### Order Processing
```javascript
// functions/index.js
exports.processOrder = functions.firestore
  .document('orders/{orderId}')
  .onCreate(async (snap, context) => {
    const order = snap.data();
    
    // Send confirmation email
    // Update inventory
    // Trigger notifications
    
    return null;
  });
```

### Analytics
```javascript
exports.updateAnalytics = functions.firestore
  .document('symptom_assessments/{assessmentId}')
  .onCreate(async (snap, context) => {
    // Update symptom statistics
    // Track popular medications
    return null;
  });
```

---

## 8. Troubleshooting

### Common Issues

#### ❌ "Firebase: No Firebase App '[DEFAULT]' has been created"
**Solution:** Make sure your `.env` file has all the correct values and restart the dev server.

#### ❌ "Missing or insufficient permissions"
**Solution:** Check your Firestore security rules. For development, use test mode.

#### ❌ Environment variables not loading
**Solution:** 
- Vite requires `VITE_` prefix for environment variables
- Restart the dev server after changing `.env`

#### ❌ CORS errors
**Solution:** This shouldn't happen with Firebase SDK, but if it does, check your Firebase project settings.

---

## 9. Next Steps

### Production Checklist
- [ ] Update Firestore security rules to production mode
- [ ] Set up Firebase Authentication (if needed)
- [ ] Configure Firebase Hosting for deployment
- [ ] Set up Firebase Cloud Functions for backend logic
- [ ] Enable Firebase Analytics
- [ ] Set up monitoring and alerts
- [ ] Add error tracking (e.g., Sentry)

### Deployment
```bash
# Build the app
npm run build

# Deploy to Firebase Hosting
firebase deploy
```

---

## 10. Useful Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)

---

## Support

If you encounter any issues, check:
1. Browser console for errors
2. Firebase Console → Firestore → Data
3. Firebase Console → Usage to ensure you're within free tier limits

**Free Tier Limits:**
- Reads: 50,000/day
- Writes: 20,000/day
- Deletes: 20,000/day
- Storage: 1 GB

For a small to medium application, these limits should be sufficient.

---

**🎉 Congratulations! Your FarmasiKu app is now connected to Firebase!**
