'use client'

import { useState } from 'react'
import { Card } from './ui/card'
import { Button } from './ui/button'
import useDiagnosticStore from '../store/useDiagnosticStore'
import { questions } from '../data/questions'

interface Question {
  universe: string
  profile: string
  question: string
  answers: {
    text: string
    level: string
  }[]
}

export function Diagnostic() {
  const { currentStep, answers, setAnswer, nextStep, previousStep } = useDiagnosticStore()
  const currentQuestion = questions[currentStep]

  const isFirstStep = currentStep === 0
  const isLastStep = currentStep === questions.length - 1

  const handleAnswer = (selectedAnswer: string) => {
    const answer = {
      universe: currentQuestion.universe,
      profile: currentQuestion.profile,
      level: currentQuestion.answers.find(a => a.text === selectedAnswer)?.level || 'Débutant',
      score: 0
    }
    setAnswer(`${answer.universe}-${answer.profile}`, answer)
  }

  return (
    <Card className="w-full max-w-2xl p-6">
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Diagnostic de compétences</h2>
          <p className="text-gray-500">
            Étape {currentStep + 1} sur {questions.length}
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold">{currentQuestion.question}</h3>
          <div className="grid gap-2">
            {currentQuestion.answers.map((answer) => (
              <Button
                key={answer.text}
                variant={answers[`${currentQuestion.universe}-${currentQuestion.profile}`]?.level === answer.level ? 'default' : 'outline'}
                className="w-full justify-start"
                onClick={() => handleAnswer(answer.text)}
              >
                {answer.text}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={previousStep}
            disabled={isFirstStep}
          >
            Précédent
          </Button>
          {isLastStep && (
            <Button onClick={() => console.log('Diagnostic terminé', answers)}>
              Terminer
            </Button>
          )}
        </div>
      </div>
    </Card>
  )
} 