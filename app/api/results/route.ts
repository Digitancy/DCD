import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, query, orderBy, serverTimestamp, where, getDoc, doc, setDoc } from 'firebase/firestore';
import { authOptions } from '@/lib/auth';

interface User {
  id: string;
  name: string;
  email: string;
  createdAt?: any;
  updatedAt?: any;
}

interface Result {
  id: string;
  score: number;
  answers: any;
  companyInfo?: any;
  userId: string;
  createdAt?: string | null;
  updatedAt?: string | null;
  user?: User;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, score, answers, companyInfo } = body;

    // Validation des champs obligatoires
    if (!companyInfo?.name || !companyInfo?.email) {
      return NextResponse.json(
        { error: 'Le nom et l\'email sont obligatoires' },
        { status: 400 }
      );
    }

    // Créer un utilisateur anonyme si nécessaire
    const usersRef = collection(db, 'users');
    const userQuery = query(usersRef, where('id', '==', userId));
    const userSnapshot = await getDocs(userQuery);
    
    let user: User;
    if (userSnapshot.empty) {
      // Créer un nouvel utilisateur avec un ID spécifique
      const userDoc = doc(usersRef, userId);
      await setDoc(userDoc, {
        name: companyInfo.name,
        email: companyInfo.email,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      user = {
        id: userId,
        name: companyInfo.name,
        email: companyInfo.email
      };
    } else {
      user = {
        id: userSnapshot.docs[0].id,
        ...userSnapshot.docs[0].data()
      } as User;
    }

    // Créer le résultat
    const resultsRef = collection(db, 'results');
    const resultRef = await addDoc(resultsRef, {
      score,
      answers,
      companyInfo,
      userId: user.id,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    // Récupérer le résultat créé
    const resultSnap = await getDoc(resultRef);
    
    return NextResponse.json({
      id: resultSnap.id,
      ...resultSnap.data(),
      user
    });
  } catch (error) {
    console.error('Erreur lors de la sauvegarde du résultat:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la sauvegarde du résultat' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Vérifier l'authentification
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    // Récupérer tous les résultats
    const resultsRef = collection(db, 'results');
    const resultsQuery = query(resultsRef, orderBy('createdAt', 'desc'));
    const resultsSnapshot = await getDocs(resultsQuery);
    
    // Récupérer les utilisateurs associés
    const usersRef = collection(db, 'users');
    const usersSnapshot = await getDocs(usersRef);
    const users: Record<string, User> = {};
    
    usersSnapshot.forEach(doc => {
      users[doc.id] = {
        id: doc.id,
        ...doc.data()
      } as User;
    });
    
    // Combiner les résultats avec les utilisateurs
    const results: Result[] = resultsSnapshot.docs.map(doc => {
      const data = doc.data();
      
      // Fonction utilitaire pour convertir les timestamps
      const convertTimestamp = (timestamp: any) => {
        if (!timestamp) return null;
        if (typeof timestamp === 'string') return timestamp;
        if (typeof timestamp.toDate === 'function') return timestamp.toDate().toISOString();
        if (timestamp.seconds) return new Date(timestamp.seconds * 1000).toISOString();
        return null;
      };

      const result = {
        id: doc.id,
        ...data,
        createdAt: convertTimestamp(data.createdAt),
        updatedAt: convertTimestamp(data.updatedAt),
        user: users[data.userId] || {
          id: data.userId,
          name: data.companyInfo?.name || 'Anonyme',
          email: data.companyInfo?.email || 'anonymous@example.com'
        }
      } as Result;
      return result;
    });

    return NextResponse.json(results);
  } catch (error) {
    console.error('Erreur lors de la récupération des résultats:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des résultats' },
      { status: 500 }
    );
  }
} 