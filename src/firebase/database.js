import { 
  collection, 
  addDoc, 
  doc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from './config';

// ==================== USER SESSIONS ====================

/**
 * Create a new user session
 * @param {Object} sessionData - User session data
 * @returns {Promise<string>} - Document ID of created session
 */
export const createUserSession = async (sessionData) => {
  try {
    const sessionRef = await addDoc(collection(db, 'user_sessions'), {
      ...sessionData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return sessionRef.id;
  } catch (error) {
    console.error('Error creating user session:', error);
    throw error;
  }
};

/**
 * Update an existing user session
 * @param {string} sessionId - Session document ID
 * @param {Object} updateData - Data to update
 */
export const updateUserSession = async (sessionId, updateData) => {
  try {
    const sessionRef = doc(db, 'user_sessions', sessionId);
    await updateDoc(sessionRef, {
      ...updateData,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating user session:', error);
    throw error;
  }
};

/**
 * Get a user session by ID
 * @param {string} sessionId - Session document ID
 * @returns {Promise<Object>} - Session data
 */
export const getUserSession = async (sessionId) => {
  try {
    const sessionRef = doc(db, 'user_sessions', sessionId);
    const sessionSnap = await getDoc(sessionRef);
    
    if (sessionSnap.exists()) {
      return { id: sessionSnap.id, ...sessionSnap.data() };
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting user session:', error);
    throw error;
  }
};

// ==================== ORDERS ====================

/**
 * Create a new order
 * @param {Object} orderData - Order details
 * @returns {Promise<string>} - Document ID of created order
 */
export const createOrder = async (orderData) => {
  try {
    const orderRef = await addDoc(collection(db, 'orders'), {
      ...orderData,
      status: 'pending',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return orderRef.id;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

/**
 * Update order status
 * @param {string} orderId - Order document ID
 * @param {string} status - New status (pending, confirmed, processing, shipped, delivered, cancelled)
 */
export const updateOrderStatus = async (orderId, status) => {
  try {
    const orderRef = doc(db, 'orders', orderId);
    await updateDoc(orderRef, {
      status,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};

/**
 * Get an order by ID
 * @param {string} orderId - Order document ID
 * @returns {Promise<Object>} - Order data
 */
export const getOrder = async (orderId) => {
  try {
    const orderRef = doc(db, 'orders', orderId);
    const orderSnap = await getDoc(orderRef);
    
    if (orderSnap.exists()) {
      return { id: orderSnap.id, ...orderSnap.data() };
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting order:', error);
    throw error;
  }
};

/**
 * Get all orders (admin function)
 * @param {number} limitCount - Number of orders to fetch
 * @returns {Promise<Array>} - Array of orders
 */
export const getAllOrders = async (limitCount = 50) => {
  try {
    const ordersQuery = query(
      collection(db, 'orders'),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(ordersQuery);
    const orders = [];
    
    querySnapshot.forEach((doc) => {
      orders.push({ id: doc.id, ...doc.data() });
    });
    
    return orders;
  } catch (error) {
    console.error('Error getting all orders:', error);
    throw error;
  }
};

/**
 * Get orders by email
 * @param {string} email - Customer email
 * @returns {Promise<Array>} - Array of orders
 */
export const getOrdersByEmail = async (email) => {
  try {
    const ordersQuery = query(
      collection(db, 'orders'),
      where('customerInfo.email', '==', email),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(ordersQuery);
    const orders = [];
    
    querySnapshot.forEach((doc) => {
      orders.push({ id: doc.id, ...doc.data() });
    });
    
    return orders;
  } catch (error) {
    console.error('Error getting orders by email:', error);
    throw error;
  }
};

// ==================== SYMPTOM ASSESSMENTS ====================

/**
 * Save a symptom assessment
 * @param {Object} assessmentData - Assessment data
 * @returns {Promise<string>} - Document ID of created assessment
 */
export const saveSymptomAssessment = async (assessmentData) => {
  try {
    const assessmentRef = await addDoc(collection(db, 'symptom_assessments'), {
      ...assessmentData,
      createdAt: serverTimestamp()
    });
    return assessmentRef.id;
  } catch (error) {
    console.error('Error saving symptom assessment:', error);
    throw error;
  }
};

/**
 * Get symptom assessments for analytics
 * @param {number} limitCount - Number of assessments to fetch
 * @returns {Promise<Array>} - Array of assessments
 */
export const getSymptomAssessments = async (limitCount = 100) => {
  try {
    const assessmentsQuery = query(
      collection(db, 'symptom_assessments'),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(assessmentsQuery);
    const assessments = [];
    
    querySnapshot.forEach((doc) => {
      assessments.push({ id: doc.id, ...doc.data() });
    });
    
    return assessments;
  } catch (error) {
    console.error('Error getting symptom assessments:', error);
    throw error;
  }
};

// ==================== MEDICATIONS (Optional - for future use) ====================

/**
 * Add a medication to catalog
 * @param {Object} medicationData - Medication details
 * @returns {Promise<string>} - Document ID of created medication
 */
export const addMedication = async (medicationData) => {
  try {
    const medicationRef = await addDoc(collection(db, 'medications'), {
      ...medicationData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return medicationRef.id;
  } catch (error) {
    console.error('Error adding medication:', error);
    throw error;
  }
};

/**
 * Get all medications
 * @returns {Promise<Array>} - Array of medications
 */
export const getAllMedications = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'medications'));
    const medications = [];
    
    querySnapshot.forEach((doc) => {
      medications.push({ id: doc.id, ...doc.data() });
    });
    
    return medications;
  } catch (error) {
    console.error('Error getting medications:', error);
    throw error;
  }
};

/**
 * Update medication details
 * @param {string} medicationId - Medication document ID
 * @param {Object} updateData - Data to update
 */
export const updateMedication = async (medicationId, updateData) => {
  try {
    const medicationRef = doc(db, 'medications', medicationId);
    await updateDoc(medicationRef, {
      ...updateData,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating medication:', error);
    throw error;
  }
};

/**
 * Delete a medication
 * @param {string} medicationId - Medication document ID
 */
export const deleteMedication = async (medicationId) => {
  try {
    await deleteDoc(doc(db, 'medications', medicationId));
  } catch (error) {
    console.error('Error deleting medication:', error);
    throw error;
  }
};

// ==================== ANALYTICS & STATISTICS ====================

/**
 * Get order statistics
 * @returns {Promise<Object>} - Statistics object
 */
export const getOrderStatistics = async () => {
  try {
    const ordersSnapshot = await getDocs(collection(db, 'orders'));
    
    let totalOrders = 0;
    let totalRevenue = 0;
    const statusCount = {
      pending: 0,
      confirmed: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0
    };
    
    ordersSnapshot.forEach((doc) => {
      const data = doc.data();
      totalOrders++;
      totalRevenue += data.totalAmount || 0;
      statusCount[data.status] = (statusCount[data.status] || 0) + 1;
    });
    
    return {
      totalOrders,
      totalRevenue,
      statusCount,
      averageOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0
    };
  } catch (error) {
    console.error('Error getting order statistics:', error);
    throw error;
  }
};

/**
 * Get common symptoms statistics
 * @returns {Promise<Object>} - Symptoms frequency
 */
export const getSymptomStatistics = async () => {
  try {
    const assessmentsSnapshot = await getDocs(collection(db, 'symptom_assessments'));
    
    const symptomCount = {};
    const bodyPartCount = {};
    
    assessmentsSnapshot.forEach((doc) => {
      const data = doc.data();
      
      // Count symptoms
      if (data.symptoms && Array.isArray(data.symptoms)) {
        data.symptoms.forEach(symptom => {
          symptomCount[symptom] = (symptomCount[symptom] || 0) + 1;
        });
      }
      
      // Count body parts
      if (data.bodyPart) {
        bodyPartCount[data.bodyPart] = (bodyPartCount[data.bodyPart] || 0) + 1;
      }
    });
    
    return {
      symptomCount,
      bodyPartCount,
      totalAssessments: assessmentsSnapshot.size
    };
  } catch (error) {
    console.error('Error getting symptom statistics:', error);
    throw error;
  }
};

// Helper function to format Firestore timestamp
export const formatTimestamp = (timestamp) => {
  if (!timestamp) return null;
  
  // If it's already a Date object
  if (timestamp instanceof Date) {
    return timestamp;
  }
  
  // If it's a Firestore Timestamp
  if (timestamp && timestamp.toDate) {
    return timestamp.toDate();
  }
  
  return null;
};
