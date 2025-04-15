'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import useDiagnosticStore from '../store/useDiagnosticStore'
import { Transition } from '../components/ui/transition'
import { Icon } from '../components/ui/components'
import { Button } from '../components/ui/button'
import { motion } from 'framer-motion'

interface FormData {
  name: string
  size: string
  sector: string
  email: string
}

export default function DiagnosticPage() {
  const router = useRouter()
  const { companyInfo, setCompanyInfo, setCurrentStep } = useDiagnosticStore()
  const [formData, setFormData] = useState<FormData>({
    name: companyInfo?.name || '',
    size: companyInfo?.size || '',
    sector: companyInfo?.sector || '',
    email: companyInfo?.email || '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setCompanyInfo(formData)
    setCurrentStep(1)
    router.push('/diagnostic/questions')
  }

  return (
    <main className="min-h-screen p-8 md:p-24 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-2xl mx-auto">
        <Transition>
          <div className="relative mb-12">
            <div className="absolute -top-20 -left-20 w-40 h-40 bg-cube-light/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-hex-light/20 rounded-full blur-3xl" />
            
            <h1 className="text-3xl font-bold text-hex-dark mb-4 relative">
              Informations de l'entreprise
              <div className="absolute -bottom-2 left-0 w-32 h-1 bg-gradient-to-r from-cube-light to-cube-dark rounded-full" />
            </h1>
            <p className="text-gray-slogan">
              Commençons par en savoir plus sur votre entreprise
            </p>
          </div>
        </Transition>

        <Transition>
          <form onSubmit={handleSubmit} className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="p-8 border border-white/10 bg-white/5 backdrop-blur-sm rounded-xl shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] hover:shadow-[0_8px_32px_0_rgba(31,38,135,0.25)] transition-all duration-300"
            >
              <div className="flex items-center space-x-3 mb-4">
                <Icon name="Building2" className="text-cube-dark" />
                <label htmlFor="name" className="block text-sm font-medium text-gray-slogan">
                  Nom de l'entreprise
                </label>
              </div>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border border-white/20 bg-white/5 rounded-xl focus:ring-2 focus:ring-cube-light focus:border-transparent transition-all duration-300"
                required
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="p-8 border border-white/10 bg-white/5 backdrop-blur-sm rounded-xl shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] hover:shadow-[0_8px_32px_0_rgba(31,38,135,0.25)] transition-all duration-300"
            >
              <div className="flex items-center space-x-3 mb-4">
                <Icon name="Mail" className="text-cube-dark" />
                <label htmlFor="email" className="block text-sm font-medium text-gray-slogan">
                  Email de contact
                </label>
              </div>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 border border-white/20 bg-white/5 rounded-xl focus:ring-2 focus:ring-cube-light focus:border-transparent transition-all duration-300"
                required
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="p-8 border border-white/10 bg-white/5 backdrop-blur-sm rounded-xl shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] hover:shadow-[0_8px_32px_0_rgba(31,38,135,0.25)] transition-all duration-300"
            >
              <div className="flex items-center space-x-3 mb-4">
                <Icon name="Users" className="text-cube-dark" />
                <label htmlFor="size" className="block text-sm font-medium text-gray-slogan">
                  Taille de l'entreprise
                </label>
              </div>
              <select
                id="size"
                value={formData.size}
                onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                className="w-full px-4 py-3 border border-white/20 bg-white/5 rounded-xl focus:ring-2 focus:ring-cube-light focus:border-transparent transition-all duration-300"
                required
              >
                <option value="">Sélectionnez une taille</option>
                <option value="1-10">1-10 employés</option>
                <option value="11-50">11-50 employés</option>
                <option value="51-200">51-200 employés</option>
                <option value="201-500">201-500 employés</option>
                <option value="501+">Plus de 500 employés</option>
              </select>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="p-8 border border-white/10 bg-white/5 backdrop-blur-sm rounded-xl shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] hover:shadow-[0_8px_32px_0_rgba(31,38,135,0.25)] transition-all duration-300"
            >
              <div className="flex items-center space-x-3 mb-4">
                <Icon name="Building2" className="text-cube-dark" />
                <label htmlFor="sector" className="block text-sm font-medium text-gray-slogan">
                  Secteur d'activité
                </label>
              </div>
              <select
                id="sector"
                value={formData.sector}
                onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                className="w-full px-4 py-3 border border-white/20 bg-white/5 rounded-xl focus:ring-2 focus:ring-cube-light focus:border-transparent transition-all duration-300"
                required
              >
                <option value="">Sélectionnez un secteur</option>
                <option value="tech">Technologies</option>
                <option value="finance">Finance</option>
                <option value="retail">Commerce</option>
                <option value="health">Santé</option>
                <option value="education">Éducation</option>
                <option value="manufacturing">Industrie</option>
                <option value="services">Services</option>
                <option value="other">Autre</option>
              </select>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Button
                type="submit"
                iconName="ArrowRight"
                iconPosition="right"
                className="w-full"
              >
                Continuer
              </Button>
            </motion.div>
          </form>
        </Transition>
      </div>
    </main>
  )
} 