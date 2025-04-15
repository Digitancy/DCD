require('dotenv').config();
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, getDocs, query, where } = require('firebase/firestore');
const bcrypt = require('bcryptjs');

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

console.log('Configuration Firebase:', {
  ...firebaseConfig,
  apiKey: '***' // Masquer la clé API pour la sécurité
});

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function createAdmin() {
  try {
    // Vérifier si l'administrateur existe déjà
    const adminRef = collection(db, 'admins');
    const q = query(adminRef, where('email', '==', 'agence.digitancy@gmail.com'));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      console.log('Un administrateur avec cet email existe déjà');
      return;
    }

    const hashedPassword = await bcrypt.hash('Digitancy@2025', 10);
    console.log('Mot de passe hashé créé');

    const adminData = {
      email: 'agence.digitancy@gmail.com',
      name: 'Digitancy',
      password: hashedPassword,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    console.log('Données de l\'administrateur à créer:', {
      ...adminData,
      password: '***' // Masquer le mot de passe hashé
    });

    const docRef = await addDoc(collection(db, 'admins'), adminData);
    console.log('Administrateur créé avec succès, ID:', docRef.id);
  } catch (error) {
    console.error('Erreur détaillée lors de la création de l\'administrateur:', error);
  }
}

createAdmin();