import { create } from 'zustand'

export interface CompanyInfo {
  name: string
  size: string
  sector: string
  email: string
}

interface Answer {
  universe: string
  profile: string
  level: 'Débutant' | 'Intermédiaire' | 'Avancé' | 'Expert'
  score: number
}

interface DiagnosticState {
  currentStep: number
  answers: { [key: string]: Answer }
  companyInfo: CompanyInfo | null
  addAnswer: (answer: Answer) => void
  setAnswer: (key: string, answer: Answer) => void
  nextStep: () => void
  previousStep: () => void
  resetDiagnostic: () => void
  setCompanyInfo: (info: CompanyInfo) => void
  setCurrentStep: (step: number) => void
}

const useDiagnosticStore = create<DiagnosticState>((set) => ({
  currentStep: 0,
  answers: {},
  companyInfo: null,
  addAnswer: (answer) =>
    set((state) => ({
      answers: { 
        ...state.answers, 
        [`${answer.universe}-${answer.profile}`]: answer 
      },
    })),
  setAnswer: (key, answer) =>
    set((state) => ({
      answers: { ...state.answers, [key]: answer },
    })),
  nextStep: () =>
    set((state) => ({
      currentStep: state.currentStep + 1,
    })),
  previousStep: () =>
    set((state) => ({
      currentStep: state.currentStep - 1,
    })),
  resetDiagnostic: () =>
    set({
      currentStep: 0,
      answers: {},
      companyInfo: null,
    }),
  setCompanyInfo: (info) =>
    set({
      companyInfo: info,
    }),
  setCurrentStep: (step) =>
    set({
      currentStep: step,
    }),
}))

export default useDiagnosticStore 