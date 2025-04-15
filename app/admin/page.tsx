'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Lock, LogOut, Search, ArrowUpDown, Eye, Trash2 } from 'lucide-react'
import { motion } from 'framer-motion';
import { Transition } from '@/components/ui/transition';
import { signOut, useSession } from 'next-auth/react';
import AdminNavbar from '@/components/ui/nav/AdminNavbar';
import { useRouter } from 'next/navigation';
import { Timestamp } from 'firebase/firestore';

interface Result {
  id: string;
  score: number;
  answers: any;
  createdAt: string | null;
  user: {
    name: string;
    email: string;
  };
}

type SortField = 'name' | 'email' | 'score' | 'createdAt';
type SortOrder = 'asc' | 'desc';

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    } else if (status === 'authenticated') {
      fetchResults();
    }
  }, [status, router]);

  const fetchResults = async () => {
    try {
      const response = await fetch('/api/results');
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des résultats');
      }
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce résultat ?')) {
      return;
    }

    setDeleteLoading(id);
    try {
      const response = await fetch(`/api/results/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression');
      }

      // Actualiser la liste
      await fetchResults();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      alert('Erreur lors de la suppression du résultat');
    } finally {
      setDeleteLoading(null);
    }
  };

  const sortResults = (a: Result, b: Result) => {
    const multiplier = sortOrder === 'asc' ? 1 : -1;
    
    switch (sortField) {
      case 'name':
        return multiplier * (a.user.name || '').localeCompare(b.user.name || '');
      case 'email':
        return multiplier * a.user.email.localeCompare(b.user.email);
      case 'score':
        return multiplier * (a.score - b.score);
      case 'createdAt':
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return multiplier * (dateA - dateB);
      default:
        return 0;
    }
  };

  const filteredResults = results
    .filter((result) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        (result.user?.name?.toLowerCase().includes(searchLower) || false) ||
        (result.user?.email?.toLowerCase().includes(searchLower) || false) ||
        result.score.toString().includes(searchLower)
      );
    })
    .sort(sortResults);

  const exportToCSV = () => {
    const headers = ['Nom', 'Email', 'Score', 'Date', 'Réponses'];
    const csvData = filteredResults.map((result) => [
      result.user?.name || 'Non renseigné',
      result.user?.email || 'Non renseigné',
      result.score,
      result.createdAt ? format(new Date(result.createdAt), 'Pp', { locale: fr }) : 'Date inconnue',
      JSON.stringify(result.answers),
    ]);

    const csvContent = [headers, ...csvData]
      .map((row) => row.map((cell) => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `resultats_digitancy_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.click();
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess(false);

    if (newPassword !== confirmPassword) {
      setPasswordError('Les mots de passe ne correspondent pas');
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError('Le nouveau mot de passe doit contenir au moins 8 caractères');
      return;
    }

    try {
      const response = await fetch('/api/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors du changement de mot de passe');
      }

      setPasswordSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
      // Fermer le modal après 2 secondes
      setTimeout(() => {
        setShowPasswordModal(false);
        setPasswordSuccess(false);
      }, 2000);
    } catch (error) {
      setPasswordError(error instanceof Error ? error.message : 'Erreur lors du changement de mot de passe');
    }
  };

  const viewResults = (result: Result) => {
    // S'assurer que les données utilisateur sont correctement formatées
    const formattedResult = {
      ...result,
      user: {
        ...result.user,
        name: result.user?.name || 'Anonyme',
        email: result.user?.email || 'anonymous@example.com'
      }
    };
    
    // Stocker les données formatées dans le localStorage
    localStorage.setItem('adminViewResult', JSON.stringify(formattedResult));
    router.push('/diagnostic/results?mode=admin');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cube-dark"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <AdminNavbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Tableau de bord administrateur</h1>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
            <div className="relative">
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cube-dark dark:bg-gray-700 dark:text-white"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            
            <div className="flex space-x-4">
              <button
                onClick={() => setShowPasswordModal(true)}
                className="bg-cube-light hover:bg-cube-dark text-white px-4 py-2 rounded-lg transition-colors duration-200"
              >
                Changer le mot de passe
              </button>
              
              <button
                onClick={exportToCSV}
                className="bg-cube-light hover:bg-cube-dark text-white px-4 py-2 rounded-lg transition-colors duration-200"
              >
                Exporter en CSV
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('name')}
                  >
                    Nom
                    {sortField === 'name' && (
                      <ArrowUpDown className="inline-block ml-1 h-4 w-4" />
                    )}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('email')}
                  >
                    Email
                    {sortField === 'email' && (
                      <ArrowUpDown className="inline-block ml-1 h-4 w-4" />
                    )}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('score')}
                  >
                    Score
                    {sortField === 'score' && (
                      <ArrowUpDown className="inline-block ml-1 h-4 w-4" />
                    )}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('createdAt')}
                  >
                    Date
                    {sortField === 'createdAt' && (
                      <ArrowUpDown className="inline-block ml-1 h-4 w-4" />
                    )}
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredResults.map((result) => (
                  <tr key={result.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {result.user.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {result.user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {result.score}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {result.createdAt
                        ? format(new Date(result.createdAt), 'dd MMMM yyyy à HH:mm', {
                            locale: fr,
                          })
                        : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => viewResults(result)}
                        className="text-cube-light hover:text-cube-dark dark:text-cube-light dark:hover:text-cube-dark mr-4"
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(result.id)}
                        className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal de changement de mot de passe */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Changer le mot de passe</h2>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Mot de passe actuel
                </label>
                <input
                  type="password"
                  id="currentPassword"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-cube-dark focus:border-cube-dark dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Nouveau mot de passe
                </label>
                <input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-cube-dark focus:border-cube-dark dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Confirmer le nouveau mot de passe
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-cube-dark focus:border-cube-dark dark:bg-gray-700 dark:text-white"
                />
              </div>
              
              {passwordError && (
                <div className="text-red-500 text-sm">{passwordError}</div>
              )}
              
              {passwordSuccess && (
                <div className="text-green-500 text-sm">Mot de passe changé avec succès !</div>
              )}
              
              <div className="flex justify-end space-x-3 mt-4">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-cube-light hover:bg-cube-dark text-white rounded-md"
                >
                  Changer le mot de passe
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 