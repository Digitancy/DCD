'use client'

import { useState } from 'react'

interface FormData {
  name: string
  email: string
  message: string
}

export function Form() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Nom
        </label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-4 py-2 border border-hex-light rounded-lg focus:ring-2 focus:ring-cube-light focus:border-transparent"
          required
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          type="email"
          id="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full px-4 py-2 border border-hex-light rounded-lg focus:ring-2 focus:ring-cube-light focus:border-transparent"
          required
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700">
          Message
        </label>
        <textarea
          id="message"
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className="w-full px-4 py-2 border border-hex-light rounded-lg focus:ring-2 focus:ring-cube-light focus:border-transparent"
          rows={4}
          required
        />
      </div>

      <button
        type="submit"
        className="w-full px-4 py-2 text-white bg-cube-light rounded-lg hover:bg-cube-dark focus:outline-none focus:ring-2 focus:ring-cube-light focus:ring-offset-2"
      >
        Envoyer
      </button>
    </form>
  )
} 