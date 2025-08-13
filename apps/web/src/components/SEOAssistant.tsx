'use client'

import { useState, useEffect } from 'react'
import { CheckCircle, XCircle, AlertTriangle, Info, Target, TrendingUp, Eye, Clock, Hash } from 'lucide-react'

interface SEOAnalysis {
  title: {
    score: number
    length: number
    optimal: { min: number; max: number }
    suggestions: string[]
  }
  description: {
    score: number
    length: number
    optimal: { min: number; max: number }
    suggestions: string[]
  }
  content: {
    score: number
    wordCount: number
    optimal: { min: number; max: number }
    suggestions: string[]
  }
  keywords: {
    score: number
    density: number
    suggestions: string[]
  }
  readability: {
    score: number
    level: string
    suggestions: string[]
  }
  overall: number
}

interface SEOAssistantProps {
  title: string
  description: string
  content: string
  keywords: string[]
  onUpdate: (field: string, value: string | string[]) => void
}

const getScoreColor = (score: number) => {
  if (score >= 80) return 'text-green-600'
  if (score >= 60) return 'text-yellow-600'
  return 'text-red-600'
}

const getScoreIcon = (score: number) => {
  if (score >= 80) return <CheckCircle className="w-5 h-5 text-green-600" />
  if (score >= 60) return <AlertTriangle className="w-5 h-5 text-yellow-600" />
  return <XCircle className="w-5 h-5 text-red-600" />
}

export default function SEOAssistant({ title, description, content, keywords, onUpdate }: SEOAssistantProps) {
  const [analysis, setAnalysis] = useState<SEOAnalysis | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  useEffect(() => {
    if (title || description || content) {
      analyzeSEO()
    }
  }, [title, description, content, keywords])

  const analyzeSEO = async () => {
    setIsAnalyzing(true)
    
    // Simüle edilmiş SEO analizi
    setTimeout(() => {
      const titleScore = analyzeTitle(title)
      const descriptionScore = analyzeDescription(description)
      const contentScore = analyzeContent(content)
      const keywordsScore = analyzeKeywords(keywords, content)
      const readabilityScore = analyzeReadability(content)
      
      const overall = Math.round((titleScore.score + descriptionScore.score + contentScore.score + keywordsScore.score + readabilityScore.score) / 5)
      
      setAnalysis({
        title: titleScore,
        description: descriptionScore,
        content: contentScore,
        keywords: keywordsScore,
        readability: readabilityScore,
        overall
      })
      
      setIsAnalyzing(false)
    }, 1000)
  }

  const analyzeTitle = (title: string): SEOAnalysis['title'] => {
    const length = title.length
    const optimal = { min: 50, max: 60 }
    
    let score = 100
    const suggestions: string[] = []
    
    if (length < optimal.min) {
      score -= 30
      suggestions.push(`Başlık çok kısa. En az ${optimal.min} karakter olmalı.`)
    } else if (length > optimal.max) {
      score -= 20
      suggestions.push(`Başlık çok uzun. En fazla ${optimal.max} karakter olmalı.`)
    }
    
    if (!title.includes('hukuk') && !title.includes('kanun') && !title.includes('yargıtay')) {
      score -= 15
      suggestions.push('Başlıkta anahtar kelimeleri kullanın.')
    }
    
    if (title.length > 0 && title[0] !== title[0].toUpperCase()) {
      score -= 10
      suggestions.push('Başlık büyük harfle başlamalı.')
    }
    
    return { score: Math.max(0, score), length, optimal, suggestions }
  }

  const analyzeDescription = (description: string): SEOAnalysis['description'] => {
    const length = description.length
    const optimal = { min: 120, max: 160 }
    
    let score = 100
    const suggestions: string[] = []
    
    if (length < optimal.min) {
      score -= 30
      suggestions.push(`Açıklama çok kısa. En az ${optimal.min} karakter olmalı.`)
    } else if (length > optimal.max) {
      score -= 20
      suggestions.push(`Açıklama çok uzun. En fazla ${optimal.max} karakter olmalı.`)
    }
    
    if (!description.includes('hukuk') && !description.includes('kanun')) {
      score -= 15
      suggestions.push('Açıklamada anahtar kelimeleri kullanın.')
    }
    
    return { score: Math.max(0, score), length, optimal, suggestions }
  }

  const analyzeContent = (content: string): SEOAnalysis['content'] => {
    const wordCount = content.split(/\s+/).filter(word => word.length > 0).length
    const optimal = { min: 300, max: 2000 }
    
    let score = 100
    const suggestions: string[] = []
    
    if (wordCount < optimal.min) {
      score -= 30
      suggestions.push(`İçerik çok kısa. En az ${optimal.min} kelime olmalı.`)
    } else if (wordCount > optimal.max) {
      score -= 10
      suggestions.push(`İçerik çok uzun. En fazla ${optimal.max} kelime olmalı.`)
    }
    
    if (content.includes('<h1>') || content.includes('<h2>')) {
      score += 10
    } else {
      score -= 20
      suggestions.push('Başlık etiketleri (H1, H2) kullanın.')
    }
    
    if (content.includes('<img')) {
      score += 5
    } else {
      suggestions.push('Görseller ekleyin.')
    }
    
    return { score: Math.max(0, Math.min(100, score)), wordCount, optimal, suggestions }
  }

  const analyzeKeywords = (keywords: string[], content: string): SEOAnalysis['keywords'] => {
    if (keywords.length === 0) {
      return { score: 0, density: 0, suggestions: ['Anahtar kelimeler ekleyin.'] }
    }
    
    let totalDensity = 0
    const contentLower = content.toLowerCase()
    
    keywords.forEach(keyword => {
      const regex = new RegExp(keyword.toLowerCase(), 'g')
      const matches = contentLower.match(regex)
      const density = matches ? (matches.length / content.split(/\s+/).length) * 100 : 0
      totalDensity += density
    })
    
    const avgDensity = totalDensity / keywords.length
    let score = 100
    
    if (avgDensity < 0.5) {
      score -= 30
    } else if (avgDensity > 3) {
      score -= 20
    }
    
    const suggestions: string[] = []
    if (avgDensity < 0.5) {
      suggestions.push('Anahtar kelimeleri içerikte daha sık kullanın.')
    } else if (avgDensity > 3) {
      suggestions.push('Anahtar kelime yoğunluğu çok yüksek.')
    }
    
    return { score: Math.max(0, score), density: avgDensity, suggestions }
  }

  const analyzeReadability = (content: string): SEOAnalysis['readability'] => {
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0)
    const words = content.split(/\s+/).filter(w => w.length > 0)
    const syllables = content.toLowerCase().replace(/[^a-z]/g, '').split('').filter(char => 'aeıioöuü'.includes(char)).length
    
    const avgWordsPerSentence = words.length / sentences.length
    const avgSyllablesPerWord = syllables / words.length
    
    let score = 100
    const suggestions: string[] = []
    
    if (avgWordsPerSentence > 20) {
      score -= 20
      suggestions.push('Cümleler çok uzun. Daha kısa cümleler kullanın.')
    }
    
    if (avgSyllablesPerWord > 2.5) {
      score -= 15
      suggestions.push('Karmaşık kelimeler yerine basit kelimeler kullanın.')
    }
    
    let level = 'Kolay'
    if (score < 60) level = 'Zor'
    else if (score < 80) level = 'Orta'
    
    return { score: Math.max(0, score), level, suggestions }
  }

  const getOverallScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-800'
    if (score >= 60) return 'bg-yellow-100 text-yellow-800'
    return 'bg-red-100 text-red-800'
  }

  if (isAnalyzing) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <h3 className="text-lg font-medium text-gray-900">SEO Analizi Yapılıyor...</h3>
        </div>
      </div>
    )
  }

  if (!analysis) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center text-gray-500">
          <Info className="w-12 h-12 mx-auto mb-3 text-gray-400" />
          <p>SEO analizi için başlık, açıklama veya içerik ekleyin.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Overall Score */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-t-lg">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">SEO Skoru</h3>
            <p className="text-sm text-gray-600">Genel SEO performansınız</p>
          </div>
          <div className={`px-4 py-2 rounded-full text-lg font-bold ${getOverallScoreColor(analysis.overall)}`}>
            {analysis.overall}/100
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Title Analysis */}
        <div className="border rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-blue-600" />
              <h4 className="font-medium text-gray-900">Başlık</h4>
            </div>
            <div className="flex items-center space-x-2">
              {getScoreIcon(analysis.title.score)}
              <span className={`font-semibold ${getScoreColor(analysis.title.score)}`}>
                {analysis.title.score}/100
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{analysis.title.length}</div>
              <div className="text-sm text-gray-500">Karakter</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-500">Optimal</div>
              <div className="text-sm font-medium">{analysis.title.optimal.min}-{analysis.title.optimal.max}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-500">Durum</div>
              <div className={`text-sm font-medium ${getScoreColor(analysis.title.score)}`}>
                {analysis.title.score >= 80 ? 'İyi' : analysis.title.score >= 60 ? 'Orta' : 'Kötü'}
              </div>
            </div>
          </div>
          
          {analysis.title.suggestions.length > 0 && (
            <div className="bg-gray-50 rounded p-3">
              <h5 className="text-sm font-medium text-gray-700 mb-2">Öneriler:</h5>
              <ul className="text-sm text-gray-600 space-y-1">
                {analysis.title.suggestions.map((suggestion, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Description Analysis */}
        <div className="border rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Eye className="w-5 h-5 text-green-600" />
              <h4 className="font-medium text-gray-900">Meta Açıklama</h4>
            </div>
            <div className="flex items-center space-x-2">
              {getScoreIcon(analysis.description.score)}
              <span className={`font-semibold ${getScoreColor(analysis.description.score)}`}>
                {analysis.description.score}/100
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{analysis.description.length}</div>
              <div className="text-sm text-gray-500">Karakter</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-500">Optimal</div>
              <div className="text-sm font-medium">{analysis.description.optimal.min}-{analysis.description.optimal.max}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-500">Durum</div>
              <div className={`text-sm font-medium ${getScoreColor(analysis.description.score)}`}>
                {analysis.description.score >= 80 ? 'İyi' : analysis.description.score >= 60 ? 'Orta' : 'Kötü'}
              </div>
            </div>
          </div>
          
          {analysis.description.suggestions.length > 0 && (
            <div className="bg-gray-50 rounded p-3">
              <h5 className="text-sm font-medium text-gray-700 mb-2">Öneriler:</h5>
              <ul className="text-sm text-gray-600 space-y-1">
                {analysis.description.suggestions.map((suggestion, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Content Analysis */}
        <div className="border rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Hash className="w-5 h-5 text-purple-600" />
              <h4 className="font-medium text-gray-900">İçerik</h4>
            </div>
            <div className="flex items-center space-x-2">
              {getScoreIcon(analysis.content.score)}
              <span className={`font-semibold ${getScoreColor(analysis.content.score)}`}>
                {analysis.content.score}/100
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{analysis.content.wordCount}</div>
              <div className="text-sm text-gray-500">Kelime</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-500">Optimal</div>
              <div className="text-sm font-medium">{analysis.content.optimal.min}-{analysis.content.optimal.max}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-500">Durum</div>
              <div className={`text-sm font-medium ${getScoreColor(analysis.content.score)}`}>
                {analysis.content.score >= 80 ? 'İyi' : analysis.content.score >= 60 ? 'Orta' : 'Kötü'}
              </div>
            </div>
          </div>
          
          {analysis.content.suggestions.length > 0 && (
            <div className="bg-gray-50 rounded p-3">
              <h5 className="text-sm font-medium text-gray-700 mb-2">Öneriler:</h5>
              <ul className="text-sm text-gray-600 space-y-1">
                {analysis.content.suggestions.map((suggestion, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Keywords Analysis */}
        <div className="border rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-orange-600" />
              <h4 className="font-medium text-gray-900">Anahtar Kelimeler</h4>
            </div>
            <div className="flex items-center space-x-2">
              {getScoreIcon(analysis.keywords.score)}
              <span className={`font-semibold ${getScoreColor(analysis.keywords.score)}`}>
                {analysis.keywords.score}/100
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{keywords.length}</div>
              <div className="text-sm text-gray-500">Anahtar Kelime</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{analysis.keywords.density.toFixed(2)}%</div>
              <div className="text-sm text-gray-500">Yoğunluk</div>
            </div>
          </div>
          
          {analysis.keywords.suggestions.length > 0 && (
            <div className="bg-gray-50 rounded p-3">
              <h5 className="text-sm font-medium text-gray-700 mb-2">Öneriler:</h5>
              <ul className="text-sm text-gray-600 space-y-1">
                {analysis.keywords.suggestions.map((suggestion, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Readability Analysis */}
        <div className="border rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-indigo-600" />
              <h4 className="font-medium text-gray-900">Okunabilirlik</h4>
            </div>
            <div className="flex items-center space-x-2">
              {getScoreIcon(analysis.readability.score)}
              <span className={`font-semibold ${getScoreColor(analysis.readability.score)}`}>
                {analysis.readability.score}/100
              </span>
            </div>
          </div>
          
          <div className="text-center mb-3">
            <div className="text-2xl font-bold text-gray-900">{analysis.readability.level}</div>
            <div className="text-sm text-gray-500">Seviye</div>
          </div>
          
          {analysis.readability.suggestions.length > 0 && (
            <div className="bg-gray-50 rounded p-3">
              <h5 className="text-sm font-medium text-gray-700 mb-2">Öneriler:</h5>
              <ul className="text-sm text-gray-600 space-y-1">
                {analysis.readability.suggestions.map((suggestion, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
