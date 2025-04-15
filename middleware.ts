import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    // Si l'utilisateur n'est pas authentifié et essaie d'accéder à une page admin
    // sauf la page de login, on le redirige vers la page de login
    if (!req.nextauth.token && 
        req.nextUrl.pathname.startsWith('/admin') && 
        !req.nextUrl.pathname.startsWith('/admin/login')) {
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }

    // Si l'utilisateur est authentifié et essaie d'accéder à la page de login,
    // on le redirige vers la page d'admin
    if (req.nextauth.token && req.nextUrl.pathname.startsWith('/admin/login')) {
      return NextResponse.redirect(new URL('/admin', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Si c'est la page de login, on autorise toujours l'accès
        if (req.nextUrl.pathname.startsWith('/admin/login')) {
          return true;
        }
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: ['/admin/:path*'],
}; 