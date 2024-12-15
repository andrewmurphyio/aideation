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
          likedIdeas,
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

  const handleFeedback = (
    idea: Idea,
    feedback: 'like' | 'superlike' | 'dislike'
  ) => {
    if (feedback === 'like' || feedback === 'superlike') {
      setLikedIdeas((prev) => [
        ...prev,
        { ...idea, superliked: feedback === 'superlike' },
      ])
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
    <div className="flex-container">
      <BuyMeACoffee />
      <div className="flex-item">
        <div className="flex flex-col md:flex-row items-center mb-4">
          <label htmlFor="existingIdeasText" className="label">
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
          <label htmlFor="thingToIdea" className="label">
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
          className={`button ${loading ? 'button-loading' : 'button-normal'}`}
        >
          {loading && (
            <svg
              className="spinner"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 .004 5.373 0 12h4z"
              ></path>
            </svg>
          )}
          {loading ? 'Generating...' : 'Generate Ideas'}
        </button>
        <div>
          {ideas.map((idea) => (
            <IdeaCard
              key={idea.id}
              idea={idea}
              onFeedback={handleFeedback}
              disabled={loading}
            />
          ))}
        </div>
      </div>
      <div className="flex-item flex-item-border">
        <h2 className="heading">Liked Ideas</h2>
        {sortedLikedIdeas.map((idea) => (
          <div
            key={idea.id}
            className="idea-card-container"
          >
            <p>
              {idea.text} {idea.superliked && '🌟'}
            </p>
            <button
              onClick={() => removeLikedIdea(idea.id)}
              className="remove-button"
              disabled={loading}
            >
              Remove
            </button>
          </div>
        ))}
        <h2 className="heading heading-margin">Disliked Ideas</h2>
        {dislikedIdeas.map((idea) => (
          <div
            key={idea.id}
            className="idea-card-container"
          >
            <p>{idea.text}</p>
            <button
              onClick={() =>
                setDislikedIdeas((prev) => prev.filter((i) => i.id !== idea.id))
              }
              className="remove-button"
              disabled={loading}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default IdeaGenerator