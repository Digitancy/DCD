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

interface DiagnosticPDFProps {
  companyInfo: {
    name: string;
    email: string;
    size: string;
    sector: string;
  };
  globalProfile: {
    universe: string;
    score: number;
    level: string;
  }[];
  results: UniverseResult[];
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

// Fonction pour arrondir les scores
const roundScore = (score: number): number => {
  return Math.round(score)
}

export default function ResultsPage() {
  const router = useRouter()
  const { companyInfo, answers, resetDiagnostic } = useDiagnosticStore()
  const [results, setResults] = useState<UniverseResult[]>([])
  const [isClient, setIsClient] = useState(false)
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  const [selectedProfile, setSelectedProfile] = useState<typeof PROFILES[number] | 'Tous'>(PROFILES[0])
  const [adminData, setAdminData] = useState<any>(null)
  const [isAdminMode, setIsAdminMode] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'details' | 'comparison'>('overview')

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
        const averageScore = profileAnswers.length > 0 ? roundScore(totalScore / profileAnswers.length) : 0
        
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
      // Créer un ID unique basé sur le nom et l'email de l'entreprise
      const userId = companyInfo ? 
        `${companyInfo.name.toLowerCase().replace(/\s+/g, '-')}-${companyInfo.email.toLowerCase().replace(/\s+/g, '-')}` : 
        'anonymous';
      
      const response = await fetch('/api/results', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
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
        globalProfile: results.map(result => ({
          universe: result.universe,
          score: Object.values(result.scores).reduce((sum, p) => sum + p.score, 0) / Object.values(result.scores).length,
          level: getLevelFromScore(
            Object.values(result.scores).reduce((sum, p) => sum + p.score, 0) / Object.values(result.scores).length
          )
        })),
        results
      }
      
      // Générer le PDF
      const pdfBlob = await pdf(<DiagnosticPDF {...pdfData} />).toBlob()
      
      // Créer un lien de téléchargement
      const url = URL.createObjectURL(pdfBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = `diagnostic-digitancy-${new Date().toISOString().split('T')[0]}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error)
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  // Calculer le score global une seule fois
  const globalScore = results.length > 0 
    ? roundScore(results.reduce((sum, universe) => 
        sum + Object.values(universe.scores).reduce((s, p) => s + p.score, 0), 0
      ) / (UNIVERSES.length * PROFILES.length))
    : 0

  const globalLevel = getLevelFromScore(globalScore)
  const globalColor = getLevelColor(globalLevel)

  // Préparer les données pour le RadarChart
  const radarData = results.map(result => {
    const dataPoint: any = { universe: result.universe }
    
    if (selectedProfile === 'Tous') {
      PROFILES.forEach(profile => {
        dataPoint[profile] = result.scores[profile].score
      })
    } else {
      dataPoint[selectedProfile] = result.scores[selectedProfile].score
    }
    
    return dataPoint
  })

  // Calculer les statistiques supplémentaires
  const calculateStats = () => {
    if (results.length === 0) return null

    // Trouver l'univers le plus fort et le plus faible
    const universeScores = results.map(result => ({
      universe: result.universe,
      score: selectedProfile === 'Tous' 
        ? PROFILES.reduce((sum, profile) => sum + result.scores[profile].score, 0) / PROFILES.length
        : result.scores[selectedProfile].score
    }))

    const strongestUniverse = universeScores.reduce((max, current) => 
      current.score > max.score ? current : max, universeScores[0])
    
    const weakestUniverse = universeScores.reduce((min, current) => 
      current.score < min.score ? current : min, universeScores[0])

    // Calculer les écarts entre profils
    const profileGaps = selectedProfile === 'Tous' ? [] : 
      results.map(result => {
        const selectedScore = result.scores[selectedProfile].score
        const otherScores = PROFILES.filter(p => p !== selectedProfile)
          .map(p => result.scores[p].score)
        
        const maxGap = Math.max(...otherScores) - selectedScore
        const minGap = selectedScore - Math.min(...otherScores)
        
        return {
          universe: result.universe,
          maxGap: maxGap > 0 ? maxGap : 0,
          minGap: minGap > 0 ? minGap : 0
        }
      })

    // Calculer la distribution des niveaux
    const levelDistribution = selectedProfile === 'Tous' 
      ? PROFILES.reduce((acc, profile) => {
          results.forEach(result => {
            const level = result.scores[profile].level
            if (!acc[level]) acc[level] = 0
            acc[level]++
          })
          return acc
        }, {} as Record<string, number>)
      : results.reduce((acc, result) => {
          const level = result.scores[selectedProfile].level
          if (!acc[level]) acc[level] = 0
          acc[level]++
          return acc
        }, {} as Record<string, number>)

    return {
      strongestUniverse,
      weakestUniverse,
      profileGaps,
      levelDistribution
    }
  }

  const stats = calculateStats()

  if (!isClient) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cube-dark"></div>
      </div>
    )
  }

  return (
    <main className="min-h-screen p-8 md:p-24 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-6xl mx-auto">
        <div className="relative mb-12">
          <div className="absolute -top-20 -left-20 w-40 h-40 bg-cube-light/20 dark:bg-cube-light/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-hex-light/20 dark:bg-hex-light/10 rounded-full blur-3xl" />
          
          <h1 className="text-3xl font-bold text-hex-dark dark:text-white mb-4 relative">
            Résultats du diagnostic
            <div className="absolute -bottom-2 left-0 w-32 h-1 bg-gradient-to-r from-cube-light to-cube-dark rounded-full" />
          </h1>
          <p className="text-gray-slogan dark:text-gray-300">
            Voici l'analyse de vos compétences digitales
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2 p-8 border-2 border-hex-dark/10 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-xl shadow-lg relative">
            <div className="absolute inset-0 bg-gradient-to-r from-hex-light/5 to-cube-light/5 dark:from-hex-light/10 dark:to-cube-light/10 rounded-xl" />
            <div className="relative">
              <h2 className="text-2xl font-bold text-hex-dark dark:text-white mb-6">Profil global</h2>
              
              <div className="flex flex-col md:flex-row items-center justify-between mb-8">
                <div className="mb-6 md:mb-0">
                  <RadialProgress 
                    value={globalScore} 
                    size="lg"
                    color={globalColor}
                  />
                </div>
                <div className="text-center md:text-left">
                  <p className="text-4xl font-bold text-cube-dark dark:text-cube-light mb-2">
                    {globalScore}%
                  </p>
                  <p className="text-xl font-medium text-gray-slogan dark:text-gray-300">
                    Niveau: {globalLevel}
                  </p>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Profil par univers</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {results.map((result, index) => (
                    <div 
                      key={index}
                      className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white/50 dark:bg-gray-800/50"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Icon 
                            name={UNIVERSES.find(u => u.name === result.universe)?.icon as any} 
                            className="text-cube-dark dark:text-cube-light"
                            size="sm"
                          />
                          <span className="font-medium text-gray-900 dark:text-white">{result.universe}</span>
                        </div>
                        {selectedProfile === 'Tous' ? (
                          <div className="flex flex-wrap gap-1 justify-end">
                            {PROFILES.map(profile => (
                              <span 
                                key={profile}
                                className="text-xs font-medium px-2 py-1 rounded whitespace-nowrap"
                                style={{ 
                                  backgroundColor: profile === 'Leaders' ? '#FF6B6B' : 
                                                 profile === 'Managers' ? '#4ECDC4' : 
                                                 profile === 'Équipes Spécialisées' ? '#45B7D1' : '#96CEB4',
                                  color: 'white'
                                }}
                              >
                                {result.scores[profile].score}%
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-sm font-medium text-cube-dark dark:text-cube-light">
                            {result.scores[selectedProfile].score}%
                          </span>
                        )}
                      </div>
                      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        {selectedProfile === 'Tous' ? (
                          <div className="flex h-full">
                            {PROFILES.map((profile, i) => (
                              <div 
                                key={profile}
                                style={{ 
                                  width: `${result.scores[profile].score}%`,
                                  backgroundColor: profile === 'Leaders' ? '#FF6B6B' : 
                                                 profile === 'Managers' ? '#4ECDC4' : 
                                                 profile === 'Équipes Spécialisées' ? '#45B7D1' : '#96CEB4'
                                }}
                              />
                            ))}
                          </div>
                        ) : (
                          <div 
                            className="h-full bg-gradient-to-r from-cube-light to-cube-dark"
                            style={{ width: `${result.scores[selectedProfile].score}%` }}
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Profil sélectionné</h3>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedProfile('Tous')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedProfile === 'Tous'
                        ? 'bg-cube-light text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    Tous les profils
                  </button>
                  {PROFILES.map((profile) => (
                    <button
                      key={profile}
                      onClick={() => setSelectedProfile(profile)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        selectedProfile === profile
                          ? 'bg-cube-light text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {profile}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-8 border-2 border-cube-dark/10 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-xl shadow-lg relative">
            <div className="absolute inset-0 bg-gradient-to-r from-cube-light/5 to-hex-light/5 dark:from-cube-light/10 dark:to-hex-light/10 rounded-xl" />
            <div className="relative">
              <h2 className="text-2xl font-bold text-cube-dark dark:text-cube-light mb-6">Radar de compétences</h2>
              
              <div className="aspect-square">
                <RadarChart 
                  data={radarData}
                  profiles={selectedProfile === 'Tous' ? PROFILES : [selectedProfile]}
                />
              </div>
              
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Niveaux de compétence</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full bg-error mr-2"></div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">Débutant (0-25%)</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full bg-warning mr-2"></div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">Intermédiaire (26-50%)</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full bg-hex mr-2"></div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">Avancé (51-75%)</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full bg-success mr-2"></div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">Expert (76-100%)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Nouveaux blocs d'informations */}
        <div className="mb-12">
          <div className="flex flex-wrap gap-4 mb-6">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'overview'
                  ? 'bg-cube-light text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Vue d'ensemble
            </button>
            <button
              onClick={() => setActiveTab('details')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'details'
                  ? 'bg-cube-light text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Détails par univers
            </button>
            <button
              onClick={() => setActiveTab('comparison')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'comparison'
                  ? 'bg-cube-light text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Comparaison des profils
            </button>
          </div>

          {activeTab === 'overview' && stats && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 shadow-md">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Points forts</h3>
                <div className="flex items-center space-x-3 mb-2">
                  <Icon 
                    name={UNIVERSES.find(u => u.name === stats.strongestUniverse.universe)?.icon as any} 
                    className="text-success"
                    size="md"
                  />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{stats.strongestUniverse.universe}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{stats.strongestUniverse.score}%</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-4">
                  Cet univers représente votre domaine de compétence le plus avancé. Vous pouvez vous appuyer sur ces forces pour développer les autres domaines.
                </p>
              </div>

              <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 shadow-md">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Points à améliorer</h3>
                <div className="flex items-center space-x-3 mb-2">
                  <Icon 
                    name={UNIVERSES.find(u => u.name === stats.weakestUniverse.universe)?.icon as any} 
                    className="text-error"
                    size="md"
                  />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{stats.weakestUniverse.universe}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{stats.weakestUniverse.score}%</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-4">
                  Cet univers nécessite le plus d'attention. Concentrez vos efforts de formation et de développement sur ce domaine.
                </p>
              </div>

              <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 shadow-md">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Distribution des niveaux</h3>
                <div className="space-y-2">
                  {Object.entries(stats.levelDistribution).map(([level, count]) => (
                    <div key={level} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full mr-2 bg-${getLevelColor(level)}`}></div>
                        <span className="text-sm text-gray-700 dark:text-gray-300">{level}</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{count}</span>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-4">
                  Cette distribution montre la répartition des niveaux de compétence dans votre diagnostic.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'details' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {results.map((result, index) => (
                <div key={index} className="p-6 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 shadow-md">
                  <div className="flex items-center space-x-3 mb-4">
                    <Icon 
                      name={UNIVERSES.find(u => u.name === result.universe)?.icon as any} 
                      className="text-cube-dark dark:text-cube-light"
                      size="md"
                    />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{result.universe}</h3>
                  </div>
                  
                  <div className="space-y-4">
                    {PROFILES.map(profile => (
                      <div key={profile} className="space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{profile}</span>
                          <span className="text-sm font-medium text-cube-dark dark:text-cube-light">
                            {result.scores[profile].score}%
                          </span>
                        </div>
                        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full"
                            style={{ 
                              width: `${result.scores[profile].score}%`,
                              backgroundColor: profile === 'Leaders' ? '#FF6B6B' : 
                                             profile === 'Managers' ? '#4ECDC4' : 
                                             profile === 'Équipes Spécialisées' ? '#45B7D1' : '#96CEB4'
                            }}
                          />
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Niveau: {result.scores[profile].level}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'comparison' && selectedProfile !== 'Tous' && stats && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 shadow-md">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Écarts avec {selectedProfile}</h3>
                <div className="space-y-4">
                  {stats.profileGaps.map((gap, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{gap.universe}</span>
                        <div className="flex space-x-2">
                          {gap.maxGap > 0 && (
                            <span className="text-xs px-2 py-1 rounded bg-error/20 text-error">
                              -{gap.maxGap}%
                            </span>
                          )}
                          {gap.minGap > 0 && (
                            <span className="text-xs px-2 py-1 rounded bg-success/20 text-success">
                              +{gap.minGap}%
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        {gap.maxGap > 0 && (
                          <div 
                            className="h-full bg-error"
                            style={{ width: `${Math.min(gap.maxGap, 100)}%` }}
                          />
                        )}
                        {gap.minGap > 0 && (
                          <div 
                            className="h-full bg-success"
                            style={{ width: `${Math.min(gap.minGap, 100)}%` }}
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-4">
                  Ces écarts montrent les différences de compétence entre {selectedProfile} et les autres profils pour chaque univers.
                </p>
              </div>

              <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 shadow-md">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recommandations</h3>
                <div className="space-y-4">
                  {stats.profileGaps.map((gap, index) => (
                    <div key={index} className="space-y-1">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white">{gap.universe}</h4>
                      {gap.maxGap > 0 && (
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {selectedProfile} est en retard de {gap.maxGap}% par rapport au profil le plus avancé. 
                          Considérez des formations spécifiques pour ce profil dans cet univers.
                        </p>
                      )}
                      {gap.minGap > 0 && (
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {selectedProfile} est en avance de {gap.minGap}% par rapport au profil le moins avancé. 
                          Partagez ces bonnes pratiques avec les autres profils.
                        </p>
                      )}
                      {gap.maxGap === 0 && gap.minGap === 0 && (
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Les niveaux de compétence sont équilibrés entre les profils pour cet univers.
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'comparison' && selectedProfile === 'Tous' && (
            <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 shadow-md">
              <p className="text-gray-600 dark:text-gray-300">
                Sélectionnez un profil spécifique pour voir les comparaisons détaillées avec les autres profils.
              </p>
            </div>
          )}
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 md:space-x-4">
          <Button
            onClick={handleNewDiagnostic}
            iconName="RefreshCw"
            iconPosition="left"
            variant="outline"
            className="w-full md:w-auto"
          >
            Nouveau diagnostic
          </Button>
          
          <Button
            onClick={handleDownloadPDF}
            iconName="Download"
            iconPosition="left"
            className="w-full md:w-auto"
            disabled={isGeneratingPDF}
          >
            {isGeneratingPDF ? 'Génération en cours...' : 'Télécharger le PDF'}
          </Button>
        </div>
      </div>
    </main>
  )
} 