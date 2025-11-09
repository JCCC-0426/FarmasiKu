# Firebase Integration Troubleshooting Guide

## Common Issues and Solutions

### Issue 1: Firestore Database Not Enabled ❌

**Symptoms:**
- No data appearing in Firebase Console
- Console errors: "Firestore is not enabled"

**Solution:**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **farmasiku-6a452**
3. Click **"Build"** in left sidebar
4. Click **"Firestore Database"**
5. If you see "Get Started", click it
6. Choose **"Start in test mode"** (for development)
7. Select a location (e.g., `asia-southeast1` for Singapore)
8. Click **"Enable"**

### Issue 2: Permission Denied Errors ❌

**Symptoms:**
- Console error: "Missing or insufficient permissions"
- Error code: `permission-denied`

**Solution - Set Firestore Rules to Test Mode:**
1. Go to Firebase Console → Firestore Database
2. Click the **"Rules"** tab
3. Replace the rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.time < timestamp.date(2026, 1, 1);
    }
  }
}
```

4. Click **"Publish"**

### Issue 3: Environment Variables Not Loading ❌

**Symptoms:**
- Firebase config shows `undefined` values
- Console error: "Firebase configuration invalid"

**Solution:**
1. Check your `.env` file has all values filled
2. Make sure each line has the format: `VITE_FIREBASE_KEY=value`
3. **Restart the dev server** after changing `.env`
   ```bash
   # Stop the server (Ctrl+C)
   npm run dev
   ```

### Issue 4: CORS or Network Errors ❌

**Symptoms:**
- Console error: "Failed to fetch"
- Network errors in browser console

**Solution:**
- Check your internet connection
- Try disabling browser extensions
- Clear browser cache
- Check Firebase service status: https://status.firebase.google.com/

## Quick Diagnostic Steps

### Step 1: Open the Test Page
1. Open `firebase-test.html` in your browser
2. It will automatically test the connection
3. Click "Test Write to Firestore" to verify write access

### Step 2: Check Browser Console
Press F12 and look for:
- ✅ "Firebase initialized successfully"
- ✅ "User session created: [ID]"
- ❌ Any error messages in red

### Step 3: Check Firebase Console
1. Go to Firebase Console → Firestore Database → Data
2. Look for these collections:
   - `test_connection` (from test page)
   - `user_sessions` (from app)
   - `orders` (from app after completing an order)

### Step 4: Test the App Flow
1. Open your app: http://localhost:3002
2. Open browser console (F12)
3. Enter age and continue
4. Look for console log: "User session created: [sessionId]"
5. If you see this, Firebase is working! ✅

## Verification Checklist

- [ ] Firebase project created
- [ ] Firestore Database enabled
- [ ] Firestore in test mode (rules allow read/write)
- [ ] `.env` file has all Firebase credentials
- [ ] Dev server restarted after updating `.env`
- [ ] Browser console shows no Firebase errors
- [ ] Test page shows "Connection Successful"

## Still Not Working?

### Check Your Current Firebase Config

Your current Firebase configuration:
```
Project ID: farmasiku-6a452
Auth Domain: farmasiku-6a452.firebaseapp.com
```

### Enable Debug Logging

Add this to `src/firebase/config.js`:

```javascript
import { initializeApp } from 'firebase/app';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';

const firebaseConfig = {
  // ... your config
};

console.log('🔥 Initializing Firebase with config:', {
  projectId: firebaseConfig.projectId,
  authDomain: firebaseConfig.authDomain
});

const app = initializeApp(firebaseConfig);
console.log('✅ Firebase app initialized');

export const db = getFirestore(app);
console.log('✅ Firestore instance created');

// Enable offline persistence (optional)
try {
  enableIndexedDbPersistence(db);
  console.log('✅ Offline persistence enabled');
} catch (err) {
  if (err.code === 'failed-precondition') {
    console.log('⚠️ Multiple tabs open, persistence enabled in first tab only');
  } else if (err.code === 'unimplemented') {
    console.log('⚠️ Browser doesn\'t support persistence');
  }
}

export default app;
```

### Check Firestore Rules in Console

Current location: Firebase Console → Firestore Database → Rules

Expected rules (test mode):
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true; // OR if request.time < timestamp.date(2026, 1, 1);
    }
  }
}
```

## Get Help

If none of these solutions work:

1. **Check browser console** (F12) - What errors do you see?
2. **Check Firebase Console** → Firestore Database → Data - Do you see any collections?
3. **Check Firebase Console** → Firestore Database → Usage - Any activity?
4. **Try the test page** - Open `firebase-test.html` and check results

## Next Steps After Fixing

Once Firebase is connected:

1. ✅ Complete a test order in your app
2. ✅ Check Firebase Console → Orders collection
3. ✅ Verify customer info is saved
4. ✅ Check user_sessions collection
5. ✅ Ready for production!

---

**Need more help?** Check:
- [FIREBASE_SETUP.md](FIREBASE_SETUP.md) - Detailed setup guide
- [FIREBASE_USAGE.md](FIREBASE_USAGE.md) - How to use Firebase functions
- Firebase Console → Project Settings → General (verify project ID)
