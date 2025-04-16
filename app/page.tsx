'use client';

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Icon } from '@/components/ui/components/Icon'
import type { IconName } from '@/components/ui/components'
import { Button } from '@/components/ui/button'
import { Transition } from '@/components/ui/transition'
import Image from 'next/image'

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
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-24">
        <Transition>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[#004D4D]/5 to-[#B4003C]/5 dark:from-[#004D4D]/10 dark:to-[#B4003C]/10 rounded-3xl -z-10" />
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-16"
            >
              <h1 className="text-4xl md:text-6xl font-bold text-[#004D4D] dark:text-[#00A3A3] mb-10 text-center">
                Évaluez vos compétences digitales<br />
                <span className="text-[#B4003C] dark:text-[#FF4D6D]">en 15 minutes</span>
                <div className="w-48 h-1 bg-[#B4003C] dark:bg-[#FF4D6D] mt-2 mx-auto" />
              </h1>

              <div className="flex flex-col md:flex-row items-center justify-between gap-12 mb-10">
                <div className="md:w-1/2 text-left">
                  <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed mb-8">
                    Vous ne savez pas toujours où <span className="font-semibold text-[#004D4D] dark:text-[#00A3A3]">concentrer vos efforts de formation digitale</span> ? Notre diagnostic vous offre une vision claire et mesurable de la maturité digitale de votre organisation à travers <span className="font-semibold text-[#B4003C] dark:text-[#FF4D6D]">6 univers clés</span> : transformation, agilité, innovation, expérience client, technologie et data.
                  </p>
                  <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed mb-8">
                    En comparant les <span className="font-semibold text-[#004D4D] dark:text-[#00A3A3]">profils</span> (leaders, managers, spécialistes, collaborateurs), vous identifiez les <span className="font-semibold text-[#B4003C] dark:text-[#FF4D6D]">écarts à combler</span> et les priorités à traiter pour faire progresser vos équipes là où cela aura le plus d'impact.
                  </p>
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                    <Button
                      onClick={() => router.push('/diagnostic')}
                      className="bg-[#B4003C] hover:bg-[#8A002E] dark:bg-[#FF4D6D] dark:hover:bg-[#FF3355] text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all transform hover:scale-105 w-full sm:w-auto"
                    >
                      Commencer le diagnostic
                    </Button>
                    <p className="text-sm text-gray-500 dark:text-gray-400 self-center">Durée estimée : 15-20 minutes</p>
                  </div>
                </div>
                
                <div className="md:w-1/2 flex justify-center md:justify-end">
                  <div className="relative transform transition-transform hover:scale-105 duration-300">
                    <Image 
                      src="/images/Astro.png" 
                      alt="Astronaute" 
                      width={400} 
                      height={400} 
                      className="rounded-2xl"
                      priority
                    />
                    <div className="absolute -bottom-4 -right-4 -z-10 w-full h-full rounded-2xl bg-[#004D4D]/5 dark:bg-[#004D4D]/20"></div>
                    <div className="absolute -top-4 -left-4 -z-10 w-full h-full rounded-2xl bg-[#B4003C]/5 dark:bg-[#B4003C]/20"></div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow"
                >
                  <h2 className="text-2xl font-bold text-[#B4003C] dark:text-[#FF4D6D] mb-6 flex items-center text-left">
                    <span className="bg-[#B4003C] dark:bg-[#FF4D6D] text-white rounded-full w-8 h-8 flex items-center justify-center text-sm mr-3">6</span>
                    Univers d'Expertise
                  </h2>
                  <div className="space-y-6">
                    {univers.map((item, index) => (
                      <div key={item.title} className="flex items-start space-x-4 group">
                        <div className="bg-[#004D4D]/5 dark:bg-[#004D4D]/10 rounded-lg p-2 group-hover:bg-[#004D4D]/10 dark:group-hover:bg-[#004D4D]/20 transition-colors">
                          <Icon name={item.icon} className="text-[#004D4D] dark:text-[#00A3A3]" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-[#004D4D] dark:text-[#00A3A3]">{item.title}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow"
                >
                  <h2 className="text-2xl font-bold text-[#B4003C] dark:text-[#FF4D6D] mb-6 flex items-center text-left">
                    <span className="bg-[#B4003C] dark:bg-[#FF4D6D] text-white rounded-full w-8 h-8 flex items-center justify-center text-sm mr-3">4</span>
                    Profils Évalués
                  </h2>
                  <div className="space-y-6">
                    {profils.map((item, index) => (
                      <div key={item.title} className="flex items-start space-x-4 group">
                        <div className="bg-[#004D4D]/5 dark:bg-[#004D4D]/10 rounded-lg p-2 group-hover:bg-[#004D4D]/10 dark:group-hover:bg-[#004D4D]/20 transition-colors">
                          <Icon name={item.icon} className="text-[#004D4D] dark:text-[#00A3A3]" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-[#004D4D] dark:text-[#00A3A3]">{item.title}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
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
                className="bg-[#004D4D]/5 dark:bg-[#004D4D]/10 rounded-xl p-8"
              >
                <h2 className="text-xl font-semibold text-[#004D4D] dark:text-[#00A3A3] mb-4 text-left">
                  Pourquoi faire le diagnostic maintenant ?
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                  <div className="flex items-start space-x-3">
                    <Icon name="Target" className="text-[#B4003C] dark:text-[#FF4D6D] flex-shrink-0 mt-1" />
                    <p className="text-gray-700 dark:text-gray-300">Obtenez un rapport détaillé sur les compétences de votre équipe</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Icon name="Target" className="text-[#B4003C] dark:text-[#FF4D6D] flex-shrink-0 mt-1" />
                    <p className="text-gray-700 dark:text-gray-300">Identifiez les priorités de formation et développement</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Icon name="Target" className="text-[#B4003C] dark:text-[#FF4D6D] flex-shrink-0 mt-1" />
                    <p className="text-gray-700 dark:text-gray-300">Recevez des recommandations personnalisées d'amélioration</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </Transition>
      </div>
    </main>
  )
} 