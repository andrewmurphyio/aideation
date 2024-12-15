import React from 'react'

interface Idea {
  id: number
  text: string
}

interface IdeaCardProps {
  idea: Idea
  onFeedback: (idea: Idea, feedback: 'like' | 'superlike' | 'dislike') => void,
  disabled?: boolean
}

const IdeaCard: React.FC<IdeaCardProps> = ({ idea, onFeedback, disabled = false }) => {

  return (
    <div className="idea-card">
      <p>{idea.text}</p>
      <button disabled={disabled} className={"dislike-button"} onClick={() => onFeedback(idea, 'dislike')}>Thumbs Down</button>
      <button disabled={disabled} className={"like-button"} onClick={() => onFeedback(idea, 'like')}>Thumbs Up</button>
      <button disabled={disabled} className={"super-like-button"} onClick={() => onFeedback(idea, 'superlike')}>Super Thumbs Up</button>
    </div>
  )
}

export default IdeaCard
