import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, name } = body;

    // Vérifier si un admin existe déjà
    const existingAdmin = await prisma.admin.findFirst();
    if (existingAdmin) {
      return NextResponse.json(
        { error: 'Un administrateur existe déjà' },
        { status: 400 }
      );
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer l'administrateur
    const admin = await prisma.admin.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });

    // Ne pas renvoyer le mot de passe
    const { password: _, ...adminWithoutPassword } = admin;
    return NextResponse.json(adminWithoutPassword);
  } catch (error) {
    console.error('Erreur lors de la création de l\'administrateur:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de l\'administrateur' },
      { status: 500 }
    );
  }
} 