import Link from 'next/link'
import { Button } from './components/ui/button'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-hex-dark mb-4">404</h1>
        <p className="text-xl text-gray-slogan mb-8">Page non trouvée</p>
        <Link href="/">
          <Button>
            Retour à l'accueil
          </Button>
        </Link>
      </div>
    </div>
  )
} 