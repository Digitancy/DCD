import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, query, orderBy, serverTimestamp, where, getDoc } from 'firebase/firestore';
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
  createdAt?: any;
  updatedAt?: any;
  user?: User;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, score, answers, companyInfo } = body;

    // Créer un utilisateur anonyme si nécessaire
    const usersRef = collection(db, 'users');
    const userQuery = query(usersRef, where('id', '==', userId));
    const userSnapshot = await getDocs(userQuery);
    
    let user: User;
    if (userSnapshot.empty) {
      // Créer un nouvel utilisateur
      const newUserRef = await addDoc(usersRef, {
        id: userId,
        name: companyInfo?.name || 'Anonyme',
        email: companyInfo?.email || 'anonymous@example.com',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      user = {
        id: newUserRef.id,
        name: companyInfo?.name || 'Anonyme',
        email: companyInfo?.email || 'anonymous@example.com'
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
      return {
        id: doc.id,
        ...data,
        user: users[data.userId] || null
      } as Result;
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