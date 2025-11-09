# Firebase Database Operations - Quick Reference

This document provides quick examples of how to use the Firebase database functions in your FarmasiKu app.

## Import Functions

```javascript
import {
  createUserSession,
  updateUserSession,
  getUserSession,
  createOrder,
  updateOrderStatus,
  getOrder,
  getOrdersByEmail,
  getAllOrders,
  saveSymptomAssessment,
  getSymptomAssessments,
  addMedication,
  getAllMedications,
  updateMedication,
  deleteMedication,
  getOrderStatistics,
  getSymptomStatistics,
  formatTimestamp
} from './firebase/database';
```

## User Sessions

### Create a New Session
```javascript
const sessionData = {
  startedAt: new Date().toISOString(),
  userAgent: navigator.userAgent,
  platform: navigator.platform
};

const sessionId = await createUserSession(sessionData);
console.log('Session created:', sessionId);
```

### Update Session
```javascript
await updateUserSession(sessionId, {
  userAge: 25,
  selectedBodyPart: 'Head',
  selectedSymptoms: ['Headache', 'Fever']
});
```

### Get Session
```javascript
const session = await getUserSession(sessionId);
console.log(session);
// { id: 'abc123', userAge: 25, selectedBodyPart: 'Head', ... }
```

## Orders

### Create an Order
```javascript
const orderData = {
  sessionId: sessionId,
  userAge: 25,
  selectedBodyPart: 'Head',
  symptoms: ['Headache', 'Fever'],
  medications: [
    { name: 'Paracetamol', price: 8.90 },
    { name: 'Ibuprofen', price: 12.50 }
  ],
  customerInfo: {
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+60123456789',
    address: '123 Main St, KL'
  },
  paymentMethod: 'card',
  totalAmount: 21.40,
  orderDate: new Date().toISOString()
};

const orderId = await createOrder(orderData);
console.log('Order created:', orderId);
```

### Update Order Status
```javascript
// Status: 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'
await updateOrderStatus(orderId, 'confirmed');
```

### Get Order by ID
```javascript
const order = await getOrder(orderId);
console.log(order);
```

### Get Orders by Email
```javascript
const customerOrders = await getOrdersByEmail('john@example.com');
console.log(`Found ${customerOrders.length} orders`);
```

### Get All Orders (Admin)
```javascript
const allOrders = await getAllOrders(50); // Limit to 50
console.log(`Total orders: ${allOrders.length}`);
```

## Symptom Assessments

### Save Assessment
```javascript
const assessmentData = {
  sessionId: sessionId,
  userAge: 25,
  bodyPart: 'Head',
  symptom: 'Headache',
  assessment: {
    symptom: 'Headache',
    duration: '2-3 days',
    severity: 'moderate',
    frequency: 'constant',
    alleviatingFactors: 'rest',
    worseningFactors: 'bright light'
  },
  timestamp: new Date().toISOString()
};

const assessmentId = await saveSymptomAssessment(assessmentData);
```

### Get Assessments (Analytics)
```javascript
const assessments = await getSymptomAssessments(100);
console.log(`Total assessments: ${assessments.length}`);
```

## Medications (Optional Catalog)

### Add Medication to Catalog
```javascript
const medicationData = {
  name: 'Paracetamol Tablets',
  price: 8.90,
  category: 'Pain Relief',
  symptoms: ['Headache', 'Fever'],
  usage: {
    method: 'oral',
    methodLabel: 'Oral (Take by mouth)',
    dosage: '500-1000mg (1-2 tablets)',
    frequency: 'Every 4-6 hours',
    maxDosage: '4000mg (8 tablets) per day',
    instructions: 'Take with water. Safe for most people.',
    duration: '3-5 days or as needed',
    icon: '💊'
  },
  inStock: true
};

const medicationId = await addMedication(medicationData);
```

### Get All Medications
```javascript
const medications = await getAllMedications();
console.log(`Available medications: ${medications.length}`);
```

### Update Medication
```javascript
await updateMedication(medicationId, {
  price: 9.50,
  inStock: true
});
```

### Delete Medication
```javascript
await deleteMedication(medicationId);
```

## Analytics & Statistics

### Get Order Statistics
```javascript
const stats = await getOrderStatistics();
console.log(`
  Total Orders: ${stats.totalOrders}
  Total Revenue: RM ${stats.totalRevenue.toFixed(2)}
  Average Order: RM ${stats.averageOrderValue.toFixed(2)}
  Pending: ${stats.statusCount.pending}
  Confirmed: ${stats.statusCount.confirmed}
  Delivered: ${stats.statusCount.delivered}
`);
```

### Get Symptom Statistics
```javascript
const symptomStats = await getSymptomStatistics();
console.log(`
  Total Assessments: ${symptomStats.totalAssessments}
  Most Common Symptoms:
`);

// Sort and display top symptoms
const sortedSymptoms = Object.entries(symptomStats.symptomCount)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 5);

sortedSymptoms.forEach(([symptom, count]) => {
  console.log(`  - ${symptom}: ${count}`);
});
```

## Utility Functions

### Format Firestore Timestamp
```javascript
import { formatTimestamp } from './firebase/database';

const order = await getOrder(orderId);
const orderDate = formatTimestamp(order.createdAt);

console.log('Order date:', orderDate.toLocaleString());
```

## Error Handling

Always wrap Firebase operations in try-catch blocks:

```javascript
try {
  const orderId = await createOrder(orderData);
  console.log('Order created successfully:', orderId);
} catch (error) {
  console.error('Failed to create order:', error);
  // Show user-friendly error message
  alert('Failed to process order. Please try again.');
}
```

## React Component Example

```javascript
import React, { useState, useEffect } from 'react';
import { createUserSession, createOrder } from './firebase/database';

function MyComponent() {
  const [sessionId, setSessionId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Create session on mount
  useEffect(() => {
    const initSession = async () => {
      try {
        const id = await createUserSession({
          startedAt: new Date().toISOString()
        });
        setSessionId(id);
      } catch (error) {
        console.error('Session creation failed:', error);
      }
    };
    initSession();
  }, []);

  const handleOrder = async (orderData) => {
    setLoading(true);
    try {
      const orderId = await createOrder({
        ...orderData,
        sessionId
      });
      alert('Order placed successfully!');
      return orderId;
    } catch (error) {
      console.error('Order failed:', error);
      alert('Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Your component JSX */}
    </div>
  );
}
```

## Best Practices

1. **Always use try-catch** - Firebase operations can fail due to network issues or permissions
2. **Validate data before saving** - Check that required fields are present
3. **Use timestamps** - `serverTimestamp()` ensures consistent time across all clients
4. **Limit query results** - Use the `limit` parameter to avoid large data transfers
5. **Index your queries** - Firebase will prompt you to create indexes for complex queries
6. **Monitor usage** - Check Firebase Console regularly to stay within free tier limits
7. **Clean up listeners** - If using real-time listeners, remember to unsubscribe
8. **Secure your rules** - Don't leave your database in test mode for production

## Common Patterns

### Loading States
```javascript
const [data, setData] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await getOrder(orderId);
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  fetchData();
}, [orderId]);

if (loading) return <div>Loading...</div>;
if (error) return <div>Error: {error}</div>;
if (!data) return <div>No data found</div>;
return <div>{/* Render data */}</div>;
```

### Batch Operations
```javascript
// If you need to create multiple documents at once
const createMultipleOrders = async (ordersArray) => {
  const promises = ordersArray.map(order => createOrder(order));
  const orderIds = await Promise.all(promises);
  return orderIds;
};
```

### Search by Date Range
```javascript
import { query, where, orderBy, getDocs, collection } from 'firebase/firestore';
import { db } from './firebase/config';

const getOrdersByDateRange = async (startDate, endDate) => {
  const ordersRef = collection(db, 'orders');
  const q = query(
    ordersRef,
    where('createdAt', '>=', startDate),
    where('createdAt', '<=', endDate),
    orderBy('createdAt', 'desc')
  );
  
  const snapshot = await getDocs(q);
  const orders = [];
  snapshot.forEach(doc => {
    orders.push({ id: doc.id, ...doc.data() });
  });
  
  return orders;
};
```

## Debugging Tips

### Check Firebase Console
1. Go to Firebase Console > Firestore Database
2. Browse your collections to verify data is being saved
3. Check the "Usage" tab to monitor API calls

### Console Logging
```javascript
// Log successful operations
const orderId = await createOrder(orderData);
console.log('✅ Order created:', orderId);

// Log errors with context
try {
  await updateOrderStatus(orderId, 'confirmed');
} catch (error) {
  console.error('❌ Failed to update order:', orderId, error);
}
```

### Test with Small Data First
- Start with test mode in Firestore
- Create a few test documents manually
- Verify read/write operations work
- Then scale up to production

---

For more detailed information, see:
- [FIREBASE_SETUP.md](FIREBASE_SETUP.md) - Initial Firebase setup
- [Firebase Documentation](https://firebase.google.com/docs/firestore)
