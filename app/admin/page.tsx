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
  createdAt: any; // Peut être un Timestamp Firestore ou une chaîne ISO
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
        let dateA: Date;
        let dateB: Date;
        
        if (typeof a.createdAt === 'string') {
          dateA = new Date(a.createdAt);
        } else if (a.createdAt && typeof a.createdAt.toDate === 'function') {
          dateA = a.createdAt.toDate();
        } else if (a.createdAt && a.createdAt.seconds) {
          dateA = new Date(a.createdAt.seconds * 1000);
        } else {
          dateA = new Date(0); // Date invalide
        }
        
        if (typeof b.createdAt === 'string') {
          dateB = new Date(b.createdAt);
        } else if (b.createdAt && typeof b.createdAt.toDate === 'function') {
          dateB = b.createdAt.toDate();
        } else if (b.createdAt && b.createdAt.seconds) {
          dateB = new Date(b.createdAt.seconds * 1000);
        } else {
          dateB = new Date(0); // Date invalide
        }
        
        return multiplier * (dateA.getTime() - dateB.getTime());
      default:
        return 0;
    }
  };

  const filteredResults = results
    .filter((result) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        result.user.name?.toLowerCase().includes(searchLower) ||
        result.user.email.toLowerCase().includes(searchLower) ||
        result.score.toString().includes(searchLower)
      );
    })
    .sort(sortResults);

  const exportToCSV = () => {
    const headers = ['Nom', 'Email', 'Score', 'Date', 'Réponses'];
    const csvData = filteredResults.map((result) => [
      result.user.name || 'Non renseigné',
      result.user.email,
      result.score,
      result.createdAt ? 
        format(
          typeof result.createdAt === 'string' 
            ? new Date(result.createdAt) 
            : (typeof result.createdAt.toDate === 'function' 
                ? result.createdAt.toDate() 
                : new Date(result.createdAt.seconds * 1000)), 
          'Pp', 
          { locale: fr }
        ) : 
        'Date inconnue',
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
    // Convertir le timestamp Firestore en format sérialisable
    const serializableResult = {
      ...result,
      createdAt: result.createdAt ? 
        (typeof result.createdAt.toDate === 'function' 
          ? result.createdAt.toDate().toISOString() 
          : (result.createdAt.seconds 
              ? new Date(result.createdAt.seconds * 1000).toISOString()
              : null)) 
        : null
    };
    
    // Stocker temporairement les données dans le localStorage
    localStorage.setItem('adminViewResult', JSON.stringify(serializableResult));
    router.push('/diagnostic/results?mode=admin');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <AdminNavbar />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <Transition>
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative w-full sm:w-auto"
              >
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-slogan h-5 w-5"
                />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full sm:w-64 border border-white/20 bg-white/5 rounded-xl focus:ring-2 focus:ring-cube-light focus:border-transparent transition-all duration-300"
                />
              </motion.div>
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                onClick={exportToCSV}
                className="flex items-center px-4 py-2 bg-gradient-to-r from-cube-light to-cube-dark text-white rounded-xl hover:from-cube-dark hover:to-cube-light transition-all duration-300 shadow-[0_4px_14px_0_rgba(0,0,0,0.1)] hover:shadow-[0_6px_20px_0_rgba(0,0,0,0.2)] transform hover:-translate-y-0.5 w-full sm:w-auto justify-center"
              >
                <Search className="h-5 w-5 mr-2" />
                Exporter en CSV
              </motion.button>
            </div>
          </Transition>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 shadow-lg rounded-xl overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-white/10">
                <thead className="bg-white/5">
                  <tr>
                    {[
                      { field: 'name' as SortField, label: 'Utilisateur' },
                      { field: 'email' as SortField, label: 'Email' },
                      { field: 'score' as SortField, label: 'Score' },
                      { field: 'createdAt' as SortField, label: 'Date' },
                    ].map((column) => (
                      <th
                        key={column.field}
                        onClick={() => handleSort(column.field)}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-slogan uppercase tracking-wider cursor-pointer hover:bg-white/5 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          {column.label}
                          <ArrowUpDown className="h-4 w-4" />
                        </div>
                      </th>
                    ))}
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-slogan uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {filteredResults.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-6 py-4 text-center text-gray-slogan text-sm"
                      >
                        Aucun résultat trouvé
                      </td>
                    </tr>
                  ) : (
                    filteredResults.map((result) => (
                      <tr
                        key={result.id}
                        className="hover:bg-white/5 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-hex-dark">
                            {result.user.name || 'Non renseigné'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-slogan">
                            {result.user.email}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-slogan">
                            {result.score}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-slogan">
                            {result.createdAt ? 
                              format(
                                typeof result.createdAt === 'string' 
                                  ? new Date(result.createdAt) 
                                  : (typeof result.createdAt.toDate === 'function' 
                                      ? result.createdAt.toDate() 
                                      : new Date(result.createdAt.seconds * 1000)), 
                                'Pp', 
                                { locale: fr }
                              ) : 
                              'Date inconnue'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => viewResults(result)}
                              className="p-2 text-gray-slogan hover:text-hex-dark transition-colors"
                              title="Voir les réponses"
                            >
                              <Eye className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleDelete(result.id)}
                              className="p-2 text-gray-slogan hover:text-red-600 transition-colors"
                              title="Supprimer"
                              disabled={deleteLoading === result.id}
                            >
                              {deleteLoading === result.id ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-600"></div>
                              ) : (
                                <Trash2 className="h-5 w-5" />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </main>

      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Changer le mot de passe</h2>
            <form onSubmit={handleChangePassword}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Mot de passe actuel
                  </label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Nouveau mot de passe
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Confirmer le nouveau mot de passe
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                {passwordError && (
                  <p className="text-red-500 text-sm">{passwordError}</p>
                )}
                {passwordSuccess && (
                  <p className="text-green-500 text-sm">
                    Mot de passe changé avec succès !
                  </p>
                )}
                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => setShowPasswordModal(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-900"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Changer le mot de passe
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 