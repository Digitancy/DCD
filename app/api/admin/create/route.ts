import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, name } = body;

    // Vérifier si un admin existe déjà
    const adminRef = collection(db, 'admins');
    const q = query(adminRef);
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      return NextResponse.json(
        { error: 'Un administrateur existe déjà' },
        { status: 400 }
      );
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer l'administrateur
    const adminData = {
      email,
      password: hashedPassword,
      name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const docRef = await addDoc(collection(db, 'admins'), adminData);

    // Ne pas renvoyer le mot de passe
    const { password: _, ...adminWithoutPassword } = adminData;
    return NextResponse.json({ id: docRef.id, ...adminWithoutPassword });
  } catch (error) {
    console.error('Erreur lors de la création de l\'administrateur:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de l\'administrateur' },
      { status: 500 }
    );
  }
} 