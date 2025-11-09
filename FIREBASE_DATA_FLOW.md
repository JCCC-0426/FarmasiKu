# FarmasiKu Firebase Data Flow

This document visualizes how data flows through your FarmasiKu application and Firebase database.

## Application Flow with Firebase Integration

```
┌─────────────────────────────────────────────────────────────────┐
│                    USER STARTS APP                              │
│                           ↓                                      │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  useEffect() on App Mount                                  │ │
│  │  → createUserSession()                                     │ │
│  │  → Firebase: Create document in 'user_sessions' collection│ │
│  │  → Returns: sessionId                                      │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────────┐
│                    STEP 1: AGE INPUT                            │
│                           ↓                                      │
│  User enters age (e.g., 25)                                     │
│  → handleAgeContinue()                                          │
│  → updateUserSession(sessionId, { userAge: 25 })               │
│  → Firebase: Update 'user_sessions/{sessionId}'                │
└─────────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────────┐
│                    STEP 2: BODY PART SELECTION                  │
│                           ↓                                      │
│  User selects body part (e.g., "Head")                          │
│  → handleBodyPartSelect()                                       │
│  → updateUserSession(sessionId, {                               │
│      selectedBodyPart: "Head",                                  │
│      bodyPartSelectedAt: timestamp                              │
│    })                                                           │
│  → Firebase: Update 'user_sessions/{sessionId}'                │
└─────────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────────┐
│                    STEP 3: SYMPTOM SELECTION                    │
│                           ↓                                      │
│  User selects symptoms (e.g., ["Headache", "Fever"])            │
│  → Symptoms stored in state                                     │
│  → No Firebase call yet (waiting for assessment)                │
└─────────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────────┐
│                    STEP 4: SYMPTOM ASSESSMENT                   │
│                           ↓                                      │
│  User assesses each symptom (duration, severity, etc.)          │
│  → handleAssessmentComplete()                                   │
│  → saveSymptomAssessment({                                      │
│      sessionId,                                                 │
│      userAge,                                                   │
│      bodyPart: "Head",                                          │
│      symptom: "Headache",                                       │
│      assessment: {                                              │
│        duration: "2-3 days",                                    │
│        severity: "moderate",                                    │
│        ...                                                      │
│      }                                                          │
│    })                                                           │
│  → Firebase: Create document in 'symptom_assessments'          │
│  → Repeat for each symptom                                     │
└─────────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────────┐
│                    STEP 5: SYMPTOM CONFIRMATION                 │
│                           ↓                                      │
│  User confirms symptoms and severity                            │
│  → handleConfirmSymptoms()                                      │
│  → updateUserSession(sessionId, {                               │
│      selectedSymptoms: ["Headache", "Fever"],                  │
│      symptomAssessments: { ... },                              │
│      isMoreSevere: false,                                       │
│      confirmedAt: timestamp                                     │
│    })                                                           │
│  → Firebase: Update 'user_sessions/{sessionId}'                │
└─────────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────────┐
│                    STEP 6: MEDICATION RECOMMENDATION            │
│                           ↓                                      │
│  App displays medications based on symptoms                     │
│  → medicationsBySymptoms(symptoms, userAge)                    │
│  → Age-based filtering applied                                  │
│  → User selects medications to order                            │
│  → No Firebase call (client-side only)                          │
└─────────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────────┐
│                    STEP 7: PAYMENT                              │
│                           ↓                                      │
│  User enters:                                                   │
│  - Name, Email, Phone, Address                                  │
│  - Payment method (card/e-wallet)                               │
│  - Card details (if card selected)                              │
│  → handlePayment()                                              │
│  → createOrder({                                                │
│      sessionId,                                                 │
│      userAge,                                                   │
│      selectedBodyPart,                                          │
│      symptoms: ["Headache", "Fever"],                           │
│      symptomAssessments: { ... },                              │
│      medications: [                                             │
│        { name: "Paracetamol", price: 8.90 },                   │
│        { name: "Ibuprofen", price: 12.50 }                     │
│      ],                                                         │
│      customerInfo: {                                            │
│        name: "John Doe",                                        │
│        email: "john@example.com",                               │
│        phone: "+60123456789",                                   │
│        address: "123 Main St, KL"                               │
│      },                                                         │
│      paymentMethod: "card",                                     │
│      totalAmount: 21.40,                                        │
│      status: "pending",                                         │
│      orderDate: timestamp                                       │
│    })                                                           │
│  → Firebase: Create document in 'orders' collection            │
│  → Returns: orderId                                             │
│  → setLastOrderId(orderId)                                      │
└─────────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────────┐
│                    STEP 8: ORDER SUCCESS                        │
│                           ↓                                      │
│  Display success message with:                                  │
│  - Order ID                                                     │
│  - Medications ordered                                          │
│  - Total price                                                  │
│  - Estimated delivery time                                      │
│                                                                 │
│  User can:                                                      │
│  → "Order Again" → handleReset()                                │
│     → Creates new user session                                  │
│     → Restarts the flow                                         │
└─────────────────────────────────────────────────────────────────┘
```

## Firebase Collections Structure

```
📁 Firestore Database
│
├── 📂 user_sessions/
│   ├── 📄 {sessionId_1}
│   │   ├── startedAt: "2024-11-08T10:30:00Z"
│   │   ├── userAgent: "Mozilla/5.0..."
│   │   ├── platform: "Win32"
│   │   ├── userAge: 25
│   │   ├── selectedBodyPart: "Head"
│   │   ├── bodyPartSelectedAt: "2024-11-08T10:31:00Z"
│   │   ├── selectedSymptoms: ["Headache", "Fever"]
│   │   ├── symptomAssessments: { Headache: {...}, Fever: {...} }
│   │   ├── isMoreSevere: false
│   │   ├── confirmedAt: "2024-11-08T10:35:00Z"
│   │   ├── createdAt: Timestamp
│   │   └── updatedAt: Timestamp
│   │
│   └── 📄 {sessionId_2}
│       └── ...
│
├── 📂 orders/
│   ├── 📄 {orderId_1}
│   │   ├── sessionId: "sessionId_1"
│   │   ├── userAge: 25
│   │   ├── selectedBodyPart: "Head"
│   │   ├── symptoms: ["Headache", "Fever"]
│   │   ├── symptomAssessments: { ... }
│   │   ├── medications: [
│   │   │     { name: "Paracetamol", price: 8.90, usage: {...} },
│   │   │     { name: "Ibuprofen", price: 12.50, usage: {...} }
│   │   │   ]
│   │   ├── customerInfo:
│   │   │   ├── name: "John Doe"
│   │   │   ├── email: "john@example.com"
│   │   │   ├── phone: "+60123456789"
│   │   │   └── address: "123 Main St, KL"
│   │   ├── paymentMethod: "card"
│   │   ├── totalAmount: 21.40
│   │   ├── status: "pending"
│   │   ├── orderDate: "2024-11-08T10:40:00Z"
│   │   ├── createdAt: Timestamp
│   │   └── updatedAt: Timestamp
│   │
│   └── 📄 {orderId_2}
│       └── ...
│
├── 📂 symptom_assessments/
│   ├── 📄 {assessmentId_1}
│   │   ├── sessionId: "sessionId_1"
│   │   ├── userAge: 25
│   │   ├── bodyPart: "Head"
│   │   ├── symptom: "Headache"
│   │   ├── assessment:
│   │   │   ├── symptom: "Headache"
│   │   │   ├── duration: "2-3 days"
│   │   │   ├── severity: "moderate"
│   │   │   ├── frequency: "constant"
│   │   │   └── ...
│   │   ├── timestamp: "2024-11-08T10:32:00Z"
│   │   └── createdAt: Timestamp
│   │
│   ├── 📄 {assessmentId_2}
│   │   ├── sessionId: "sessionId_1"
│   │   ├── symptom: "Fever"
│   │   └── ...
│   │
│   └── 📄 {assessmentId_3}
│       └── ...
│
└── 📂 medications/ (Optional - for future use)
    ├── 📄 {medicationId_1}
    │   ├── name: "Paracetamol Tablets"
    │   ├── price: 8.90
    │   ├── category: "Pain Relief"
    │   ├── symptoms: ["Headache", "Fever"]
    │   ├── usage: { method: "oral", dosage: "...", ... }
    │   ├── inStock: true
    │   ├── createdAt: Timestamp
    │   └── updatedAt: Timestamp
    │
    └── 📄 {medicationId_2}
        └── ...
```

## Data Flow Summary

### Write Operations (App → Firebase)
1. **Session Created** → `user_sessions` collection
2. **Age Entered** → Update `user_sessions/{sessionId}`
3. **Body Part Selected** → Update `user_sessions/{sessionId}`
4. **Symptom Assessed** → Create document in `symptom_assessments`
5. **Symptoms Confirmed** → Update `user_sessions/{sessionId}`
6. **Order Placed** → Create document in `orders`

### Read Operations (Firebase → App)
- Currently, the app primarily **writes** data to Firebase
- **Future features** could read data for:
  - Order history (by email)
  - Reordering medications
  - Admin dashboard
  - Analytics reports

## State Management Flow

```javascript
// React Component State
┌────────────────────────┐
│  App.jsx State         │
├────────────────────────┤
│ - step                 │  ← Navigation state
│ - userAge              │  ↓ Saved to Firebase
│ - selectedBodyPart     │  ↓ Saved to Firebase
│ - selectedSymptoms     │  ↓ Saved to Firebase
│ - symptomAssessments   │  ↓ Saved to Firebase
│ - selectedMedications  │  ↓ Saved to Firebase
│ - sessionId            │  ← Firebase session ID
│ - lastOrderId          │  ← Firebase order ID
└────────────────────────┘
         ↓
         ↓ Firebase Functions
         ↓
┌────────────────────────┐
│  Firebase Firestore    │
├────────────────────────┤
│ - user_sessions        │
│ - orders               │
│ - symptom_assessments  │
└────────────────────────┘
```

## Error Handling Flow

```
User Action
    ↓
Try Firebase Operation
    ↓
    ├─→ Success
    │   ├── Log to console
    │   ├── Update state
    │   └── Continue flow
    │
    └─→ Error
        ├── Log error to console
        ├── Show user-friendly message
        └── Allow user to retry
```

## Performance Considerations

### Optimizations in Place
1. **Session Created Once** - Only on app mount, reused throughout
2. **Batched Updates** - Session updated at key milestones, not every action
3. **Lazy Assessment Saving** - Only saved when assessment completed
4. **Single Order Write** - All order data written in one operation

### Firebase Pricing Impact
- **1 User Session** → 1 write + n updates (~3-5 writes total)
- **Symptom Assessments** → 1 write per symptom (~2-4 writes)
- **1 Order** → 1 write
- **Total per user** → ~10-15 writes (well within free tier)

## Analytics Possibilities

### With Current Data, You Can Track:
1. **User Journey**
   - Average time per step
   - Drop-off points
   - Most selected body parts
   - Common symptom combinations

2. **Business Metrics**
   - Total orders
   - Revenue (total, average)
   - Most purchased medications
   - Peak order times

3. **Health Insights**
   - Most common symptoms
   - Symptom patterns by age group
   - Seasonal trends
   - Geographic patterns (with location data)

### Example Analytics Query
```javascript
// Get most common symptoms
const stats = await getSymptomStatistics();
const topSymptoms = Object.entries(stats.symptomCount)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 10);

console.log('Top 10 Symptoms:', topSymptoms);
// [["Headache", 45], ["Fever", 38], ["Cough", 32], ...]
```

## Future Enhancements

### Admin Dashboard
```
Admin Panel (Future)
    ↓
Read Firebase Data
    ├── getAllOrders() → Display order list
    ├── updateOrderStatus() → Mark as shipped
    ├── getOrderStatistics() → Show revenue
    └── getSymptomStatistics() → Show trends
```

### Customer Portal
```
Customer Login (Future)
    ↓
Firebase Authentication
    ↓
getOrdersByEmail(email)
    ↓
Display Order History
    ├── View past orders
    ├── Track current orders
    └── Reorder medications
```

### Real-time Updates
```
Firebase Real-time Listeners (Future)
    ↓
onSnapshot('orders/{orderId}')
    ↓
Auto-update UI when status changes
    ├── "Order Confirmed"
    ├── "Out for Delivery"
    └── "Delivered"
```

---

## Visual Summary

```
USER ACTION → REACT STATE → FIREBASE FUNCTION → FIRESTORE DATABASE
                                                        ↓
                                                 STORED IN CLOUD
                                                        ↓
                                           AVAILABLE FOR QUERIES
                                                        ↓
                                              ANALYTICS & REPORTS
```

This structure ensures:
- ✅ All critical data is saved
- ✅ User journey is tracked
- ✅ Orders are never lost
- ✅ Analytics data available
- ✅ Scalable for future features

---

For more details, see:
- [FIREBASE_SETUP.md](FIREBASE_SETUP.md) - Setup instructions
- [FIREBASE_USAGE.md](FIREBASE_USAGE.md) - API reference
- [FIREBASE_INTEGRATION_SUMMARY.md](FIREBASE_INTEGRATION_SUMMARY.md) - Overview
