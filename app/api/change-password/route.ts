import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
  try {
    const { currentPassword, newPassword } = await request.json();

    // Vérifier le mot de passe actuel
    if (currentPassword !== 'digitancy2025') {
      return NextResponse.json(
        { error: 'Mot de passe actuel incorrect' },
        { status: 401 }
      );
    }

    // Lire le contenu du fichier auth.ts
    const authFilePath = path.join(process.cwd(), 'app', 'lib', 'auth.ts');
    let content = await fs.readFile(authFilePath, 'utf-8');

    // Remplacer l'ancien mot de passe par le nouveau
    content = content.replace(
      /const ADMIN_PASSWORD = ['"].*?['"];/,
      `const ADMIN_PASSWORD = '${newPassword}';`
    );

    // Écrire les modifications dans le fichier
    await fs.writeFile(authFilePath, content, 'utf-8');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur lors du changement de mot de passe:', error);
    return NextResponse.json(
      { error: 'Erreur lors du changement de mot de passe' },
      { status: 500 }
    );
  }
} 