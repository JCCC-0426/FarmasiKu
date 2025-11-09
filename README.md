# farmasiKu - Mobile App Prototype

A symptom-based medication recommendation mobile app prototype built with React + Vite.

## Features

1. **Symptom Selection**
   - Body part selection (Skin, Feet, Head, etc.)
   - Multiple symptom selection
   - Support for adding more symptoms

2. **Symptom Confirmation**
   - Display all selected symptoms
   - Ask about symptom severity
   - Redirect severe cases to online doctor consultation

3. **Medication Recommendation**
   - Intelligent medication recommendation based on symptoms
   - Display medication names and prices (RM)
   - One-click ordering functionality

4. **Order Confirmation**
   - Display order success information
   - Estimated delivery time (30 minutes)

5. **Firebase Integration** 🔥
   - Real-time database for storing orders
   - User session tracking
   - Symptom assessment analytics
   - Order management system

## Tech Stack

- **React 18** - UI Framework
- **Vite** - Build Tool
- **CSS3** - Mobile-first Responsive Design
- **Firebase** - Backend & Database
  - Firestore - NoSQL Database
  - Firebase Analytics - User Analytics

## Installation and Running

### Prerequisites

- Node.js 14+
- npm or yarn

### Install Dependencies

```bash
npm install
```

### Configure Firebase

1. Copy `.env.example` to `.env`
2. Fill in your Firebase credentials (see [FIREBASE_SETUP.md](FIREBASE_SETUP.md) for detailed instructions)

```bash
cp .env.example .env
```

### Development Mode

```bash
npm run dev
```

The app will run on `http://localhost:5173` (Vite default port)

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
farmasiKu/
├── src/
│   ├── components/          # React Components
│   │   ├── AgeInput.jsx
│   │   ├── BodyPartSelection.jsx
│   │   ├── SymptomSelection.jsx
│   │   ├── SymptomAssessment.jsx
│   │   ├── SymptomConfirmation.jsx
│   │   ├── MedicationRecommendation.jsx
│   │   ├── Payment.jsx
│   │   ├── ConsultationRedirect.jsx
│   │   ├── OrderSuccess.jsx
│   │   ├── DangerWarning.jsx
│   │   ├── ProgressIndicator.jsx
│   │   └── BackButton.jsx
│   ├── firebase/            # Firebase configuration
│   │   ├── config.js        # Firebase initialization
│   │   └── database.js      # Database operations
│   ├── data/
│   │   └── appData.js       # App data (body parts, symptoms, medications)
│   ├── styles/              # Global styles
│   │   ├── index.css
│   │   └── App.css
│   ├── App.jsx              # Main app component
│   └── main.jsx             # App entry point
├── .env                     # Environment variables (not in git)
├── .env.example             # Environment template
├── index.html
├── package.json
├── vite.config.js
├── FIREBASE_SETUP.md        # Firebase setup guide
└── README.md
```

## User Flow

1. **Enter Age** - User enters their age (for age-appropriate medication recommendations)
2. **Select Body Part** - User selects the body part where they feel discomfort
3. **Select Symptoms** - Choose from the symptom list for that body part (multiple selections allowed)
4. **Symptom Assessment** - Detailed assessment for each symptom (duration, severity, etc.)
5. **Add More Symptoms** - Option to select other body parts to add more symptoms
6. **Confirm Symptoms** - Confirm selected symptoms and assess severity
7. **Danger Warning** - Alert for dangerous symptoms with consultation option
8. **Medication Recommendation** - Recommend medications based on symptoms and age
9. **Payment** - Enter customer details and payment information
10. **Success Page** - Display order success and estimated delivery time

### Firebase Data Flow

- User session created on app start
- Session updated as user progresses through steps
- Symptom assessments saved for analytics
- Complete order saved to database on payment
- All data timestamped for tracking

## Mobile Adaptation

- Responsive design supporting various screen sizes
- Touch-friendly buttons and interactions
- Mobile-first UI design
- Smooth page transition animations

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Firebase Collections

The app uses the following Firestore collections:

- **user_sessions** - Track user interactions and flow through the app
- **orders** - Store completed orders with customer and medication details
- **symptom_assessments** - Analytics data for symptom patterns
- **medications** (optional) - Dynamic medication catalog

For detailed database structure, see [FIREBASE_SETUP.md](FIREBASE_SETUP.md#5-database-structure)

## Future Development Suggestions

- [ ] Add user login/registration functionality (Firebase Authentication)
- [ ] Implement real payment gateway integration
- [ ] Add order history and tracking
- [ ] Implement medication search functionality
- [ ] Add user rating and review system
- [ ] Integrate real doctor consultation platform
- [ ] Add push notification functionality (Firebase Cloud Messaging)
- [ ] Implement admin dashboard for order management
- [ ] Add Firebase Cloud Functions for automated workflows
- [ ] Set up Firebase Analytics for user behavior tracking
- [ ] Implement real-time order status updates
- [ ] Add prescription upload feature (Firebase Storage)

## License

MIT License
