'use client';

import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { status } = useSession();
  const pathname = usePathname();

  // Ne pas vérifier l'authentification sur la page de connexion
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  // Afficher un état de chargement pendant la vérification de la session
  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return <>{children}</>;
} 