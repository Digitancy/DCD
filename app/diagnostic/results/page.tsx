'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import useDiagnosticStore from '../../store/useDiagnosticStore'
import { RadialProgress } from '../../components/ui/radial-progress'
import { Transition } from '../../components/ui/transition'
import { Icon } from '../../components/ui/components/Icon'
import { Button } from '../../components/ui/button'
import { motion } from 'framer-motion'
import { RadarChart } from '../../components/RadarChart'
import { DiagnosticPDF } from '../../components/DiagnosticPDF'
import { pdf } from '@react-pdf/renderer'

interface UniverseResult {
  universe: string
  scores: {
    [profile: string]: {
      level: string
      score: number
    }
  }
}

const UNIVERSES = [
  { name: 'Transformation Digitale', icon: 'Rocket' },
  { name: 'Agilité', icon: 'GitBranch' },
  { name: 'Innovation', icon: 'Lightbulb' },
  { name: 'Expérience Client', icon: 'Users' },
  { name: 'Technologie', icon: 'Laptop' },
  { name: 'Data', icon: 'Database' }
] as const

const PROFILES = [
  'Leaders',
  'Managers',
  'Équipes Spécialisées',
  'Collaborateurs (Tous)'
] as const

const getLevelValue = (level: string) => {
  switch (level) {
    case 'Débutant': return 25
    case 'Intermédiaire': return 50
    case 'Avancé': return 75
    case 'Expert': return 100
    default: return 0
  }
}

const getLevelColor = (level: string) => {
  switch (level) {
    case 'Débutant': return 'error'
    case 'Intermédiaire': return 'warning'
    case 'Avancé': return 'hex'
    case 'Expert': return 'success'
    default: return 'cube'
  }
}

const getLevelFromScore = (score: number): string => {
  if (score <= 25) return 'Débutant'
  if (score <= 50) return 'Intermédiaire'
  if (score <= 75) return 'Avancé'
  return 'Expert'
}

export default function ResultsPage() {
  const router = useRouter()
  const { companyInfo, answers, resetDiagnostic } = useDiagnosticStore()
  const [results, setResults] = useState<UniverseResult[]>([])
  const [isClient, setIsClient] = useState(false)
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  const [selectedProfile, setSelectedProfile] = useState<typeof PROFILES[number]>(PROFILES[0])
  const [adminData, setAdminData] = useState<any>(null)
  const [isAdminMode, setIsAdminMode] = useState(false)

  useEffect(() => {
    setIsClient(true)
    // Vérifier si on est en mode admin
    const urlParams = new URLSearchParams(window.location.search)
    const mode = urlParams.get('mode')
    if (mode === 'admin') {
      const savedData = localStorage.getItem('adminViewResult')
      if (savedData) {
        const parsedData = JSON.parse(savedData)
        setAdminData(parsedData)
        setIsAdminMode(true)
      }
      // Nettoyer le localStorage
      localStorage.removeItem('adminViewResult')
    }
  }, [])

  useEffect(() => {
    if (!isClient) return

    // En mode admin, utiliser les données stockées
    if (isAdminMode && adminData) {
      const processedResults = processAnswers(adminData.answers)
      setResults(processedResults)
      return
    }

    // Mode normal : vérifier si des réponses existent
    if (!isAdminMode && Object.keys(answers).length === 0) {
      router.push('/diagnostic')
      return
    }

    // Traitement des réponses pour générer les résultats
    const processedResults = processAnswers(answers)
    setResults(processedResults)

    // Sauvegarder les résultats uniquement en mode normal
    if (!isAdminMode) {
      saveResults(processedResults)
    }
  }, [isClient, answers, companyInfo, router, isAdminMode, adminData])

  const processAnswers = (answersData: any) => {
    return UNIVERSES.map(universe => {
      const universeResult: UniverseResult = {
        universe: universe.name,
        scores: {}
      }

      PROFILES.forEach(profile => {
        const profileAnswers = Object.values(answersData).filter((answer: any) => 
          answer.universe === universe.name && answer.profile === profile
        )
        
        const totalScore = profileAnswers.reduce((sum: number, answer: any) => sum + getLevelValue(answer.level), 0)
        const averageScore = profileAnswers.length > 0 ? totalScore / profileAnswers.length : 0
        
        universeResult.scores[profile] = {
          level: getLevelFromScore(averageScore),
          score: averageScore
        }
      })

      return universeResult
    })
  }

  const saveResults = async (processedResults: UniverseResult[]) => {
    try {
      const response = await fetch('/api/results', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: 'anonymous',
          score: processedResults.reduce((sum, universe) => 
            sum + Object.values(universe.scores).reduce((s, p) => s + p.score, 0), 0
          ) / (UNIVERSES.length * PROFILES.length),
          answers: answers,
          companyInfo: companyInfo
        }),
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la sauvegarde des résultats')
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des résultats:', error)
    }
  }

  const handleNewDiagnostic = () => {
    resetDiagnostic()
    router.push('/diagnostic')
  }

  const handleDownloadPDF = async () => {
    if (!companyInfo && !isAdminMode) return

    setIsGeneratingPDF(true)
    try {
      console.log('Début de la génération du PDF')
      const pdfData = {
        companyInfo: isAdminMode ? {
          name: adminData?.user?.name || 'Non renseigné',
          email: adminData?.user?.email || '',
          size: '',
          sector: ''
        } : (companyInfo || {
          name: 'Non renseigné',
          email: '',
          size: '',
          sector: ''
        }),
        globalProfile,
        results
      }
      console.log('Données:', pdfData)
      
      const blob = await pdf(
        <DiagnosticPDF
          companyInfo={pdfData.companyInfo}
          globalProfile={globalProfile}
          results={results}
        />
      ).toBlob()
      
      console.log('PDF généré avec succès')
      
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `diagnostic-${pdfData.companyInfo.name.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Erreur détaillée lors de la génération du PDF:', error)
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  if (!isClient || (!companyInfo && !isAdminMode)) {
    return null
  }

  const displayCompanyInfo = isAdminMode ? {
    name: adminData?.user?.name || 'Non renseigné',
    size: '',
    sector: ''
  } : (companyInfo || {
    name: 'Non renseigné',
    size: '',
    sector: ''
  })

  // Préparation des données pour le graphique radar
  const radarData = UNIVERSES.map(universe => {
    const result = results.find(r => r.universe === universe.name)
    return {
      universe: universe.name,
      ...Object.fromEntries(
        PROFILES.map(profile => [
          profile,
          Math.round(result?.scores[profile]?.score || 0)
        ])
      )
    }
  })

  // Calcul du profil général
  const globalProfile = UNIVERSES.map(universe => {
    const result = results.find(r => r.universe === universe.name)
    if (!result) return { universe: universe.name, score: 0, level: 'Débutant' }

    const averageScore = Math.round(
      Object.values(result.scores).reduce((sum, { score }) => sum + score, 0) / 
      Object.values(result.scores).length
    )

    return {
      universe: universe.name,
      score: averageScore,
      level: getLevelFromScore(averageScore)
    }
  })

  // Calcul des écarts entre profils
  const profileGaps = UNIVERSES.map(universe => {
    const result = results.find(r => r.universe === universe.name)
    if (!result) return { 
      universe: universe.name, 
      maxGap: 0, 
      highest: { profiles: [], score: 0 },
      lowest: { profiles: [], score: 0 }
    }

    const scores = Object.entries(result.scores).map(([profile, data]) => ({
      profile,
      score: data.score
    }))

    const maxScore = Math.max(...scores.map(s => s.score))
    const minScore = Math.min(...scores.map(s => s.score))
    const gap = maxScore - minScore

    const highestProfiles = scores.filter(s => s.score === maxScore).map(s => s.profile)
    const lowestProfiles = scores.filter(s => s.score === minScore).map(s => s.profile)

    return {
      universe: universe.name,
      maxGap: gap,
      highest: {
        profiles: highestProfiles,
        score: maxScore
      },
      lowest: {
        profiles: lowestProfiles,
        score: minScore
      }
    }
  })

  return (
    <main className="min-h-screen p-8 md:p-24 bg-gradient-to-b from-white to-gray-50">
      {isAdminMode && (
        <div className="max-w-7xl mx-auto mb-8">
          <Button
            onClick={() => router.push('/admin')}
            variant="outline"
            className="mb-4"
          >
            <Icon name="ArrowRight" size="sm" className="mr-2" />
            Retour à l'administration
          </Button>
          {adminData && (
            <div className="bg-white p-4 rounded-lg shadow mb-6">
              <h2 className="text-xl font-semibold mb-2">Informations utilisateur</h2>
              <p>Nom : {adminData.user.name || 'Non renseigné'}</p>
              <p>Email : {adminData.user.email}</p>
              <p>Date : {adminData.createdAt ? new Date(adminData.createdAt).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              }) : 'Date inconnue'}</p>
            </div>
          )}
        </div>
      )}
      
      <div className="max-w-6xl mx-auto">
        <Transition>
          <div className="relative mb-16">
            <div className="absolute -top-20 -left-20 w-40 h-40 bg-cube-light/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-hex-light/20 rounded-full blur-3xl" />
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <h1 className="text-4xl md:text-6xl font-bold text-hex-dark mb-6">
                Résultats du Diagnostic
              </h1>
              <div>
                <h2 className="text-xl font-semibold text-cube-dark mb-2">
                  {displayCompanyInfo.name}
                </h2>
                <p className="text-gray-slogan">
                  {displayCompanyInfo.size} • {displayCompanyInfo.sector}
                </p>
              </div>
            </motion.div>
          </div>
        </Transition>

        <Transition>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Graphique Radar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="p-8 border border-white/10 bg-white/5 backdrop-blur-sm rounded-xl shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] hover:shadow-[0_8px_32px_0_rgba(31,38,135,0.25)] transition-all duration-300"
            >
              <h3 className="text-xl font-semibold text-hex-dark mb-6">
                Vue d'ensemble par univers
              </h3>
              <RadarChart data={radarData} profiles={PROFILES} />
            </motion.div>

            {/* Sélecteur de profil et résultats détaillés */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="p-8 border border-white/10 bg-white/5 backdrop-blur-sm rounded-xl shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] hover:shadow-[0_8px_32px_0_rgba(31,38,135,0.25)] transition-all duration-300"
            >
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-hex-dark mb-4">
                  Résultats par profil
                </h3>
                <div className="flex flex-wrap gap-2">
                  {PROFILES.map((profile) => (
                    <button
                      key={profile}
                      onClick={() => setSelectedProfile(profile)}
                      className={`px-4 py-2 rounded-full text-sm transition-all duration-300 ${
                        selectedProfile === profile
                          ? 'bg-cube-dark text-white'
                          : 'bg-white/10 text-gray-slogan hover:bg-cube-light/20'
                      }`}
                    >
                      {profile}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                {UNIVERSES.map((universe) => {
                  const result = results.find(r => r.universe === universe.name)
                  const profileScore = result?.scores[selectedProfile]
                  
                  return (
                    <div key={universe.name} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Icon name={universe.icon} className="text-cube-dark" size="sm" />
                        <div>
                          <span className="text-gray-slogan">{universe.name}</span>
                          <div className="text-sm text-gray-400">
                            {profileScore?.level || 'Non évalué'}
                          </div>
                        </div>
                      </div>
                      <RadialProgress
                        value={profileScore?.score || 0}
                        color={getLevelColor(profileScore?.level || 'Débutant')}
                        size="sm"
                      />
                    </div>
                  )
                })}
              </div>
            </motion.div>
          </div>
        </Transition>

        <Transition>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Profil général */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="p-8 border border-white/10 bg-white/5 backdrop-blur-sm rounded-xl shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] hover:shadow-[0_8px_32px_0_rgba(31,38,135,0.25)] transition-all duration-300"
            >
              <h3 className="text-xl font-semibold text-hex-dark mb-6">
                Profil général de l'entreprise
              </h3>
              <div className="space-y-6">
                {globalProfile.map((item) => (
                  <div key={item.universe} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Icon 
                        name={UNIVERSES.find(u => u.name === item.universe)?.icon || 'Building2'} 
                        className="text-cube-dark" 
                        size="sm"
                      />
                      <div>
                        <span className="text-gray-slogan">{item.universe}</span>
                        <div className="text-sm text-gray-400">
                          {item.level}
                        </div>
                      </div>
                    </div>
                    <RadialProgress
                      value={item.score}
                      color={getLevelColor(item.level)}
                      size="sm"
                    />
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Analyse des écarts */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="p-8 border border-white/10 bg-white/5 backdrop-blur-sm rounded-xl shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] hover:shadow-[0_8px_32px_0_rgba(31,38,135,0.25)] transition-all duration-300"
            >
              <h3 className="text-xl font-semibold text-hex-dark mb-6">
                Analyse des écarts entre profils
              </h3>
              <div className="space-y-6">
                {profileGaps
                  .filter(gap => gap.maxGap > 0)
                  .sort((a, b) => b.maxGap - a.maxGap)
                  .map((gap) => (
                    <div key={gap.universe} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Icon 
                            name={UNIVERSES.find(u => u.name === gap.universe)?.icon || 'Building2'} 
                            className="text-cube-dark" 
                            size="sm"
                          />
                          <span className="text-gray-slogan">{gap.universe}</span>
                        </div>
                        <span className="text-sm font-medium text-gray-400">
                          Écart de {gap.maxGap}%
                        </span>
                      </div>
                      <div className="pl-8 space-y-1">
                        <div className="flex items-center text-sm">
                          <Icon name="ChartBar" className="w-4 h-4 text-green-500 mr-2" size="sm" />
                          <span className="text-gray-400">
                            {gap.highest.profiles.join(', ')} ({gap.highest.score}%)
                          </span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Icon name="ChartBar" className="w-4 h-4 text-red-500 mr-2 transform rotate-180" size="sm" />
                          <span className="text-gray-400">
                            {gap.lowest.profiles.join(', ')} ({gap.lowest.score}%)
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </motion.div>
          </div>
        </Transition>

        <Transition>
          <div className="flex flex-col items-center space-y-6">
            <div className="flex justify-center space-x-6">
              <Button
                onClick={handleNewDiagnostic}
                iconName="RefreshCw"
                iconPosition="left"
              >
                Nouveau diagnostic
              </Button>
              <Button
                onClick={handleDownloadPDF}
                variant="outline"
                iconName={isGeneratingPDF ? undefined : "FileText"}
                iconPosition="left"
                isLoading={isGeneratingPDF}
              >
                {isGeneratingPDF ? 'Génération du PDF...' : 'Télécharger le rapport'}
              </Button>
            </div>
          </div>
        </Transition>
      </div>
    </main>
  )
} 