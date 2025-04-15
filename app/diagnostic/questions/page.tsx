'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import useDiagnosticStore from '../../store/useDiagnosticStore'
import { questions } from '../../data/questions'
import { Icon } from '../../components/ui/components/Icon'
import { type IconName } from '../../components/ui/components/LucideIcon'
import { motion } from 'framer-motion'

type UniverseKey = 'Transformation Digitale' | 'Agilité' | 'Innovation' | 'Expérience Client' | 'Technologie' | 'Data'
type ProfileKey = 'Leaders' | 'Managers' | 'Équipes Spécialisées' | 'Collaborateurs (Tous)'

const universeIcons: Record<UniverseKey, IconName> = {
  'Transformation Digitale': 'Rocket',
  'Agilité': 'GitBranch',
  'Innovation': 'Lightbulb',
  'Expérience Client': 'Users',
  'Technologie': 'Laptop',
  'Data': 'Database'
}

const profileIcons: Record<ProfileKey, IconName> = {
  'Leaders': 'Crown',
  'Managers': 'UserCog',
  'Équipes Spécialisées': 'Code',
  'Collaborateurs (Tous)': 'User'
}

export default function QuestionsPage() {
  const router = useRouter()
  const { addAnswer, setCurrentStep } = useDiagnosticStore()
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)

  const currentQuestion = questions[currentQuestionIndex]

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [currentQuestionIndex])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (selectedAnswer === null) return

    addAnswer({
      universe: currentQuestion.universe,
      profile: currentQuestion.profile,
      level: currentQuestion.answers[selectedAnswer].level,
      score: 0
    })

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setSelectedAnswer(null)
    } else {
      setCurrentStep(2)
      router.push('/diagnostic/results')
    }
  }

  return (
    <main className="min-h-screen p-8 md:p-24 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-2xl mx-auto">
        <div className="relative mb-12">
          <div className="absolute -top-20 -left-20 w-40 h-40 bg-cube-light/20 dark:bg-cube-light/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-hex-light/20 dark:bg-hex-light/10 rounded-full blur-3xl" />
          
          <div className="p-6 border-2 border-hex-dark/10 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-xl shadow-lg relative mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-hex-light/5 to-cube-light/5 dark:from-hex-light/10 dark:to-cube-light/10 rounded-xl" />
            <div className="relative">
              <div className="flex items-center space-x-3 mb-4">
                <Icon 
                  name={universeIcons[currentQuestion.universe as UniverseKey]} 
                  className="text-hex-dark dark:text-hex-light"
                  size="lg"
                />
                <h1 className="text-3xl font-bold text-hex-dark dark:text-white">
                  {currentQuestion.universe}
                </h1>
              </div>
              
              <div className="flex items-center justify-between">
                <p className="text-gray-slogan dark:text-gray-300">
                  Question {currentQuestionIndex + 1} sur {questions.length}
                </p>
                <div className="h-2 w-48 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-cube-light to-cube-dark"
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 border-2 border-cube-dark/10 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-xl shadow-lg relative mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-cube-light/5 to-hex-light/5 dark:from-cube-light/10 dark:to-hex-light/10 rounded-xl" />
          <div className="relative">
            <div className="flex items-center space-x-3 mb-4">
              <Icon 
                name={profileIcons[currentQuestion.profile as ProfileKey]} 
                className="text-cube-dark dark:text-cube-light"
                size="md"
              />
              <h2 className="text-xl font-semibold text-cube-dark dark:text-cube-light">
                {currentQuestion.profile}
              </h2>
            </div>
            <p className="text-gray-slogan dark:text-gray-300">
              {currentQuestion.question}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            {currentQuestion.answers.map((answer, index) => (
              <motion.label
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className={`block p-6 border rounded-xl cursor-pointer transition-all duration-300 ${
                  selectedAnswer === index
                    ? 'border-cube-light bg-cube-light bg-opacity-10 dark:bg-cube-light/20 shadow-[0_8px_32px_0_rgba(31,38,135,0.25)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.4)]'
                    : 'border-white/10 dark:border-gray-700 bg-white/5 dark:bg-gray-800/50 backdrop-blur-sm hover:border-cube-light/50 dark:hover:border-cube-light/30 shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]'
                }`}
              >
                <input
                  type="radio"
                  name="answer"
                  value={index}
                  checked={selectedAnswer === index}
                  onChange={() => setSelectedAnswer(index)}
                  className="hidden"
                />
                <span className="font-medium text-gray-slogan dark:text-gray-300">{answer.text}</span>
              </motion.label>
            ))}
          </div>

          <motion.button
            type="submit"
            disabled={selectedAnswer === null}
            whileHover={selectedAnswer !== null ? { scale: 1.02 } : undefined}
            whileTap={selectedAnswer !== null ? { scale: 0.98 } : undefined}
            className={`w-full px-8 py-4 rounded-xl transition-all duration-300 ${
              selectedAnswer !== null
                ? 'bg-gradient-to-r from-cube-light to-cube-dark text-white shadow-[0_4px_14px_0_rgba(0,0,0,0.1)] hover:shadow-[0_6px_20px_0_rgba(0,0,0,0.2)]'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
            }`}
          >
            {currentQuestionIndex === questions.length - 1
              ? 'Terminer'
              : 'Question suivante'}
          </motion.button>
        </form>
      </div>
    </main>
  )
} 