import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, score, answers, companyInfo } = body;

    // Créer un utilisateur anonyme si nécessaire
    let user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          id: userId,
          name: companyInfo?.name || 'Anonyme',
          email: companyInfo?.email || 'anonymous@example.com',
        },
      });
    }

    const result = await prisma.result.create({
      data: {
        score,
        answers,
        companyInfo,
        userId: user.id,
      },
      include: {
        user: true,
      },
    });

    return NextResponse.json(result);
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

    // Récupérer tous les résultats avec les informations utilisateur
    const results = await prisma.result.findMany({
      include: {
        user: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
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