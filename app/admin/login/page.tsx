'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Icon } from '@/components/ui/components/Icon';

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;

    try {
      const result = await signIn('credentials', {
        username,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Identifiants incorrects');
      } else {
        router.push('/admin');
      }
    } catch (error) {
      setError('Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-8 md:p-24 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative mb-12">
            <div className="absolute -top-20 -left-20 w-40 h-40 bg-cube-light/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-hex-light/20 rounded-full blur-3xl" />
            
            <div className="flex flex-col items-center mb-8">
              <Image
                src="/images/digitancy-logo.png"
                alt="Digitancy Logo"
                width={200}
                height={80}
                priority
                className="mb-6"
              />
            </div>

            <h1 className="text-3xl font-bold text-hex-dark mb-4 relative text-center">
              Administration Digitancy
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-cube-light to-cube-dark rounded-full" />
            </h1>
            <p className="text-gray-slogan text-center">
              Connectez-vous pour accéder au tableau de bord
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="p-8 border border-white/10 bg-white/5 backdrop-blur-sm rounded-xl shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] hover:shadow-[0_8px_32px_0_rgba(31,38,135,0.25)] transition-all duration-300"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <Icon name="User" className="text-cube-dark" size="sm" />
                <label htmlFor="username" className="block text-sm font-medium text-gray-slogan">
                  Nom d'utilisateur
                </label>
              </div>
              <input
                type="text"
                id="username"
                name="username"
                required
                className="w-full px-4 py-3 border border-white/20 bg-white/5 rounded-xl focus:ring-2 focus:ring-cube-light focus:border-transparent transition-all duration-300"
              />
            </div>

            <div>
              <div className="flex items-center space-x-3 mb-2">
                <Icon name="Lock" className="text-cube-dark" size="sm" />
                <label htmlFor="password" className="block text-sm font-medium text-gray-slogan">
                  Mot de passe
                </label>
              </div>
              <input
                type="password"
                id="password"
                name="password"
                required
                className="w-full px-4 py-3 border border-white/20 bg-white/5 rounded-xl focus:ring-2 focus:ring-cube-light focus:border-transparent transition-all duration-300"
              />
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-500 text-sm"
              >
                {error}
              </motion.p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full px-8 py-4 bg-gradient-to-r from-cube-light to-cube-dark text-white rounded-xl hover:from-cube-dark hover:to-cube-light transition-all duration-300 shadow-[0_4px_14px_0_rgba(0,0,0,0.1)] hover:shadow-[0_6px_20px_0_rgba(0,0,0,0.2)] transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <Icon name="RefreshCw" className="mr-2" size="sm" spin />
                  Connexion en cours...
                </div>
              ) : (
                'Se connecter'
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </main>
  );
} 