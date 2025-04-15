import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { db } from '@/lib/firebase';
import { doc, deleteDoc, getDoc } from 'firebase/firestore';
import { authOptions } from '@/lib/auth';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Vérifier l'authentification
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    // Vérifier si le résultat existe
    const resultRef = doc(db, 'results', params.id);
    const resultSnap = await getDoc(resultRef);
    
    if (!resultSnap.exists()) {
      return NextResponse.json(
        { error: 'Résultat non trouvé' },
        { status: 404 }
      );
    }

    // Supprimer le résultat
    await deleteDoc(resultRef);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur lors de la suppression du résultat:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du résultat' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Vérifier l'authentification
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    // Récupérer le résultat
    const resultRef = doc(db, 'results', params.id);
    const resultSnap = await getDoc(resultRef);
    
    if (!resultSnap.exists()) {
      return NextResponse.json(
        { error: 'Résultat non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: resultSnap.id,
      ...resultSnap.data()
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du résultat:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du résultat' },
      { status: 500 }
    );
  }
} 