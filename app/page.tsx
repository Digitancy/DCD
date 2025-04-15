'use client';

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Icon } from '@/components/ui/components/Icon'
import type { IconName } from '@/components/ui/components'
import { Button } from '@/components/ui/button'
import { Transition } from '@/components/ui/transition'

const univers: Array<{
  title: string
  description: string
  icon: IconName
}> = [
  {
    title: 'Transformation Digitale',
    description: 'Évaluez votre capacité à mener la transformation numérique',
    icon: 'Rocket'
  },
  {
    title: 'Agilité',
    description: 'Mesurez votre adaptabilité aux changements rapides',
    icon: 'GitBranch'
  },
  {
    title: 'Innovation',
    description: 'Découvrez votre potentiel d\'innovation digitale',
    icon: 'Lightbulb'
  },
  {
    title: 'Expérience Client',
    description: 'Analysez votre approche client à l\'ère numérique',
    icon: 'Users'
  },
  {
    title: 'Technologie',
    description: 'Évaluez votre maîtrise des outils digitaux',
    icon: 'Laptop'
  },
  {
    title: 'Data',
    description: 'Mesurez votre capacité à exploiter les données',
    icon: 'Database'
  }
]

const profils: Array<{
  title: string
  description: string
  icon: IconName
}> = [
  {
    title: 'Leaders',
    description: 'Pour les décideurs et dirigeants',
    icon: 'Crown'
  },
  {
    title: 'Managers',
    description: 'Pour les chefs d\'équipe et responsables',
    icon: 'UserCog'
  },
  {
    title: 'Équipes spécialisées',
    description: 'Pour les experts métiers',
    icon: 'Code'
  },
  {
    title: 'Collaborateurs',
    description: 'Pour tous les membres de l\'équipe',
    icon: 'User'
  }
]

export default function HomePage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-24">
        <Transition>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[#004D4D]/5 to-[#B4003C]/5 rounded-3xl -z-10" />
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-16"
            >
              <h1 className="text-4xl md:text-6xl font-bold text-[#004D4D] mb-6">
                Diagnostic des Compétences<br />Digitales
                <div className="w-48 h-1 bg-[#B4003C] mt-2 mx-auto" />
              </h1>
              <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8 leading-relaxed">
                Découvrez le niveau de maturité digitale de votre équipe et obtenez un plan d'action personnalisé. 
                Notre diagnostic évalue les compétences clés dans 6 univers essentiels, vous permettant d'identifier 
                précisément les forces et les axes d'amélioration de vos collaborateurs.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
                <Button
                  onClick={() => router.push('/diagnostic')}
                  className="bg-[#B4003C] hover:bg-[#8A002E] text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all transform hover:scale-105 hover:shadow-lg w-full sm:w-auto"
                >
                  Commencer le diagnostic
                </Button>
                <p className="text-sm text-gray-500">Durée estimée : 15-20 minutes</p>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow"
              >
                <h2 className="text-2xl font-bold text-[#B4003C] mb-6 flex items-center">
                  <span className="bg-[#B4003C] text-white rounded-full w-8 h-8 flex items-center justify-center text-sm mr-3">6</span>
                  Univers d'Expertise
                </h2>
                <div className="space-y-6">
                  {univers.map((item, index) => (
                    <div key={item.title} className="flex items-start space-x-4 group">
                      <div className="bg-[#004D4D]/5 rounded-lg p-2 group-hover:bg-[#004D4D]/10 transition-colors">
                        <Icon name={item.icon} className="text-[#004D4D]" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-[#004D4D]">{item.title}</h3>
                        <p className="text-sm text-gray-600">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow"
              >
                <h2 className="text-2xl font-bold text-[#B4003C] mb-6 flex items-center">
                  <span className="bg-[#B4003C] text-white rounded-full w-8 h-8 flex items-center justify-center text-sm mr-3">4</span>
                  Profils Évalués
                </h2>
                <div className="space-y-6">
                  {profils.map((item, index) => (
                    <div key={item.title} className="flex items-start space-x-4 group">
                      <div className="bg-[#004D4D]/5 rounded-lg p-2 group-hover:bg-[#004D4D]/10 transition-colors">
                        <Icon name={item.icon} className="text-[#004D4D]" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-[#004D4D]">{item.title}</h3>
                        <p className="text-sm text-gray-600">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-center bg-[#004D4D]/5 rounded-xl p-8"
            >
              <h2 className="text-xl font-semibold text-[#004D4D] mb-4">
                Pourquoi faire le diagnostic maintenant ?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                <div className="flex items-start space-x-3">
                  <Icon name="Target" className="text-[#B4003C] flex-shrink-0 mt-1" />
                  <p className="text-gray-700">Obtenez un rapport détaillé sur les compétences de votre équipe</p>
                </div>
                <div className="flex items-start space-x-3">
                  <Icon name="Target" className="text-[#B4003C] flex-shrink-0 mt-1" />
                  <p className="text-gray-700">Identifiez les priorités de formation et développement</p>
                </div>
                <div className="flex items-start space-x-3">
                  <Icon name="Target" className="text-[#B4003C] flex-shrink-0 mt-1" />
                  <p className="text-gray-700">Recevez des recommandations personnalisées d'amélioration</p>
                </div>
              </div>
            </motion.div>
          </div>
        </Transition>
      </div>
    </main>
  )
} 