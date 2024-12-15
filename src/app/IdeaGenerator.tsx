'use client'
import React, { useState, useEffect } from 'react'
import IdeaCard from './IdeaCard'
import { BuyMeACoffee } from './BuyMeACoffee'

interface Idea {
  id: number
  text: string
  superliked?: boolean
}

const IdeaGenerator: React.FC = () => {
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [likedIdeas, setLikedIdeas] = useState<Idea[]>([])
  const [dislikedIdeas, setDislikedIdeas] = useState<Idea[]>([])
  const [existingIdeasText, setExistingIdeasText] = useState<string>('')
  const [thingToIdea, setThingToIdea] = useState<string>('new blog posts')
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    const savedIdeas = localStorage.getItem('ideas')
    if (savedIdeas) setIdeas(JSON.parse(savedIdeas))

    const savedLikedIdeas = localStorage.getItem('likedIdeas')
    if (savedLikedIdeas) setLikedIdeas(JSON.parse(savedLikedIdeas))

    const savedDislikedIdeas = localStorage.getItem('dislikedIdeas')
    if (savedDislikedIdeas) setDislikedIdeas(JSON.parse(savedDislikedIdeas))

    const savedExistingIdeasText = localStorage.getItem('existingIdeasText')
    if (savedExistingIdeasText) setExistingIdeasText(savedExistingIdeasText)

    const savedThingToIdea = localStorage.getItem('thingToIdea')
    if (savedThingToIdea) setThingToIdea(savedThingToIdea)
  }, [])

  useEffect(() => {
    localStorage.setItem('ideas', JSON.stringify(ideas))
  }, [ideas])

  useEffect(() => {
    localStorage.setItem('likedIdeas', JSON.stringify(likedIdeas))
  }, [likedIdeas])

  useEffect(() => {
    localStorage.setItem('dislikedIdeas', JSON.stringify(dislikedIdeas))
  }, [dislikedIdeas])

  useEffect(() => {
    localStorage.setItem('existingIdeasText', existingIdeasText)
  }, [existingIdeasText])

  useEffect(() => {
    localStorage.setItem('thingToIdea', thingToIdea)
  }, [thingToIdea])

  const generateIdeas = async () => {
    setLoading(true)
    const existingIdeas = existingIdeasText
      .split('\n')
      .map((idea) => idea.trim())
      .filter((idea) => idea.length > 0)
    try {
      const response = await fetch('/api/generateIdeas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          existingIdeas,
          likedIdeas: likedIdeas.filter((idea) => !idea.superliked),
          superLikedIdeas: likedIdeas.filter((idea) => idea.superliked),
          dislikedIdeas,
          thingToIdea,
          numberOfIdeas: 20,
        }),
      })
      const data = await response.json()
      setIdeas(data.ideas)
    } catch (error) {
      console.error('Error generating ideas:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFeedback = (idea: Idea, feedback: 'like' | 'superlike' | 'dislike') => {
    if (feedback === 'like' || feedback === 'superlike') {
      setLikedIdeas((prev) => [...prev, { ...idea, superliked: feedback === 'superlike' }])
    } else if (feedback === 'dislike') {
      setDislikedIdeas((prev) => [...prev, idea])
    }
    setIdeas((prev) => prev.filter((i) => i.id !== idea.id))
  }

  const removeLikedIdea = (id: number) => {
    setLikedIdeas((prev) => prev.filter((idea) => idea.id !== id))
  }

  const sortedLikedIdeas = likedIdeas.sort(
    (a, b) => (b.superliked ? 1 : 0) - (a.superliked ? 1 : 0)
  )

  return (
    <div className="flex flex-col md:flex-row">
      <BuyMeACoffee />
      <div className="flex-1 p-4">
        <div className="flex flex-col md:flex-row items-center mb-4">
          <label htmlFor="existingIdeasText" className="mr-2 font-semibold">
            Existing Ideas
          </label>
          <textarea
            id="existingIdeasText"
            value={existingIdeasText}
            onChange={(e) => setExistingIdeasText(e.target.value)}
            placeholder="Enter existing ideas, one per line"
            className="textbox w-full h-32"
            disabled={loading}
          />
        </div>
        <div className="flex flex-col md:flex-row items-center mb-4">
          <label htmlFor="thingToIdea" className="mr-2 font-semibold">
            Thing to Generate Ideas For
          </label>
          <input
            id="thingToIdea"
            type="text"
            value={thingToIdea}
            onChange={(e) => setThingToIdea(e.target.value)}
            placeholder="Enter the thing to generate ideas for"
            className="textbox flex-1"
            disabled={loading}
          />
        </div>
        <button
          onClick={generateIdeas}
          disabled={loading}
          className={`mx-4 mt-4 px-6 py-2 ${
            loading ? 'bg-blue-300' : 'bg-blue-500 hover:bg-blue-600'
          } text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition-all flex items-center`}>
          {loading && (
            <svg
              className="animate-spin h-5 w-5 mr-3 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 .004 5.373 0 12h4z"></path>
            </svg>
          )}
          {loading ? 'Generating...' : 'Generate Ideas'}
        </button>
        <div>
          {ideas.map((idea, index) => (
            <IdeaCard key={index} idea={idea} onFeedback={handleFeedback} disabled={loading} />
          ))}
        </div>
      </div>
      <div className="flex-1 p-4 border-t md:border-t-0 md:border-l border-gray-300">
        <h2 className="text-xl font-bold mb-4">Liked Ideas</h2>
        {sortedLikedIdeas.map((idea, index) => (
          <div key={index} className="idea-card flex justify-between items-center">
            <p>
              {idea.text} {idea.superliked && '🌟'}
            </p>
            <button
              onClick={() => removeLikedIdea(idea.id)}
              className="text-red-500 hover:text-red-700"
              disabled={loading}>
              Remove
            </button>
          </div>
        ))}
        <h2 className="text-xl font-bold mt-8 mb-4">Disliked Ideas</h2>
        {dislikedIdeas.map((idea, index) => (
          <div key={index} className="idea-card flex justify-between items-center">
            <p>{idea.text}</p>
            <button
              onClick={() => setDislikedIdeas((prev) => prev.filter((i) => i.id !== idea.id))}
              className="text-red-500 hover:text-red-700"
              disabled={loading}>
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default IdeaGenerator
