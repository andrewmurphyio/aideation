import { NextRequest, NextResponse } from 'next/server'

import { azure } from '@ai-sdk/azure'
import { generateObject } from 'ai'

import { z } from 'zod'

const IdeaSchema = z.object({
  id: z.number(),
  text: z.string(),
})

const RequestSchema = z.object({
  existingIdeas: z.array(z.string()),
  likedIdeas: z.array(IdeaSchema),
  dislikedIdeas: z.array(IdeaSchema),
  thingToIdea: z.string().min(1, 'thingToIdea cannot be empty'),
  numberOfIdeas: z.number().positive(),
})

const ResponseObject = z.object({
  ideas: z.array(IdeaSchema),
})

export async function POST(request: NextRequest) {
  try {
    const requestData = await request.json()
    const { existingIdeas, likedIdeas, dislikedIdeas, thingToIdea, numberOfIdeas } =
      RequestSchema.parse(requestData)

    const prompt = `
              You are an AI assistant helping to generate new ideas for ${thingToIdea}.
              Existing ideas: ${existingIdeas.join(', ')}.
              Liked ideas: ${likedIdeas.map((idea: any) => idea.text).join(', ')}.
              Disliked ideas: ${dislikedIdeas.map((idea: any) => idea.text).join(', ')}.
              Generate ${numberOfIdeas} new and unique ideas that are different from the existing ones.
              `

    console.log(prompt);

    const result = await generateObject({
      // model: openai("gpt-4o"),
      model: azure('gpt-4o-2024-05-13'),
      messages: [{ role: 'system', content: prompt }],
      schema: ResponseObject,
    })

    return NextResponse.json({ ideas: result.object.ideas })
  } catch (error) {
    if (error instanceof Error) {
        return NextResponse.json({ error: error.message }, { status: 400 })
      }
      return NextResponse.json({ error: 'An unknown error occurred' }, { status: 400 })
  }
}
