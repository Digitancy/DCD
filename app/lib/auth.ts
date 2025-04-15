import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { db } from './firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import bcrypt from 'bcryptjs';

interface AdminData {
  id: string;
  email: string;
  name: string;
  password: string;
  createdAt: string;
  updatedAt: string;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email et mot de passe requis');
        }

        try {
          // Rechercher l'administrateur dans Firestore
          const adminRef = collection(db, 'admins');
          const q = query(adminRef, where('email', '==', credentials.email));
          const querySnapshot = await getDocs(q);

          if (querySnapshot.empty) {
            throw new Error('Identifiants invalides');
          }

          const admin = {
            id: querySnapshot.docs[0].id,
            ...querySnapshot.docs[0].data()
          } as AdminData;

          // Vérifier le mot de passe
          const passwordMatch = await bcrypt.compare(credentials.password, admin.password);

          if (!passwordMatch) {
            throw new Error('Identifiants invalides');
          }

          // Ne pas inclure le mot de passe dans les données de session
          const { password, ...adminWithoutPassword } = admin;
          return adminWithoutPassword;
        } catch (error) {
          console.error('Erreur d\'authentification:', error);
          throw error;
        }
      }
    })
  ],
  session: {
    strategy: 'jwt'
  },
  pages: {
    signIn: '/admin/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
      }
      return session;
    }
  }
}; 