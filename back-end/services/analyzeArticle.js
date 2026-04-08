import 'dotenv/config'
import OpenAI from 'openai'

const client = process.env.GROQ_API_KEY
  ? new OpenAI({
      apiKey: process.env.GROQ_API_KEY,
      baseURL: 'https://api.groq.com/openai/v1'
    })
  : null

const POSITIVE_WORDS = ['praised', 'progress', 'breakthrough', 'success', 'improve', 'improved', 'positive', 'promising', 'striking']
const NEGATIVE_WORDS = ['crisis', 'fail', 'failed', 'failure', 'decline', 'negative', 'angry', 'devastating', 'horrifying']
const TOPIC_KEYWORDS = {
  Politics: ['election', 'senate', 'congress', 'president', 'minister', 'campaign', 'policy'],
  Climate: ['climate', 'emissions', 'wildfire', 'carbon', 'temperature'],
  Entertainment: ['movie', 'music', 'celebrity', 'festival', 'show'],
  Technology: ['ai', 'software', 'chip', 'startup', 'device', 'app'],
  Education: ['school', 'student', 'teacher', 'university', 'campus'],
  Business: ['market', 'stocks', 'company', 'economy', 'earnings', 'ceo'],
  Sports: ['game', 'team', 'season', 'player', 'coach', 'tournament'],
  Health: ['hospital', 'health', 'disease', 'medical', 'vaccine'],
  Science: ['nasa', 'scientist', 'scientists', 'research', 'space', 'artemis', 'experiment']
}

function clampScore(value, min, max) {
  return Math.max(min, Math.min(max, value))
}

function matchesKeyword(normalizedText, keyword) {
  const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return new RegExp(`\\b${escapedKeyword}\\b`, 'i').test(normalizedText)
}

function getFallbackTopic(articleText) {
  const normalizedText = articleText.toLowerCase()

  for (const [topic, keywords] of Object.entries(TOPIC_KEYWORDS)) {
    if (keywords.some((keyword) => matchesKeyword(normalizedText, keyword))) {
      return topic
    }
  }

  return 'General'
}

function extractEvidenceQuotes(articleText) {
  return articleText
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean)
    .slice(0, 2)
}

function getBiasLabel(score) {
  if (score <= -0.7) return 'Left'
  if (score <= -0.25) return 'Center-Left'
  if (score >= 0.7) return 'Right'
  if (score >= 0.25) return 'Center-Right'
  return 'Center'
}

function buildFallbackAnalysis(articleText, reason = 'Heuristic analysis generated locally.') {
  const normalizedText = articleText.toLowerCase()
  const positiveHits = POSITIVE_WORDS.filter((word) => normalizedText.includes(word)).length
  const negativeHits = NEGATIVE_WORDS.filter((word) => normalizedText.includes(word)).length
  const sentimentScore = clampScore(Number(((positiveHits - negativeHits) / 5).toFixed(2)), -1, 1)
  const biasScore = clampScore(Number(((normalizedText.match(/should|must|clearly|obviously|critics say|many believe/g) || []).length / 10).toFixed(2)), 0, 1)

  return {
    sentimentLabel: sentimentScore > 0.2 ? 'Positive' : sentimentScore < -0.2 ? 'Negative' : 'Neutral',
    sentimentScore,
    detectedTopic: getFallbackTopic(articleText),
    biasLabel: getBiasLabel(biasScore),
    biasScore,
    confidenceScore: 0.35,
    explanation: reason,
    evidenceLines: extractEvidenceQuotes(articleText)
  }
}

export async function analyzeWithLLM(articleText){
    const prompt = `
        You are a strict JSON generator. Do NOT include any text outside JSON.
        Return ONLY valid JSON.
        Do not include markdown.
        Do not include explanation outside JSON.
        Do not prefix or suffix the JSON with any text.

        Analyze the article and return EXACTLY this JSON format:

        {
        "sentimentLabel": "Positive | Neutral | Negative",
        "sentimentScore": number,
        "detectedTopic": "Politics | Climate | Entertainment | Technology | Education | Business | Sports | Health | Science | General",
        "biasLabel": "Left | Center-Left | Center | Center-Right | Right",
        "biasScore": number,
        "confidenceScore": number,
        "explanation": "string",
        "evidenceLines": ["quote1", "quote2"]
        }

        Rules:
        - sentimentScore must be between -1 and 1
        - biasScore and confidenceScore must be between 0 and 1
        - evidenceLines MUST be exact quotes from the article
        - only choose ONE of the options for sentimentLabel
        - only choose ONE of the options for biasLabel
        - only choose ONE of the options for detectedTopic
        - Right means right-wing, republican, conservative; Left means left-wing, democratic, liberal
        - Use only standard ASCII double quotes (") for all JSON strings.
        - Do not use smart quotes.
        - output must be a single complete JSON object

        Article:
        """
        ${articleText.slice(0, 3000)}
        """
        `

    if (!client) {
        return buildFallbackAnalysis(articleText, 'GROQ_API_KEY is not configured, so a local heuristic analysis was used.')
    }

    try {
        const completion = await client.chat.completions.create({
            model: 'llama-3.1-8b-instant',
            temperature: 0,
            messages: [
                { role: 'system', content: 'You output only valid JSON.' },
                { role: 'user', content: prompt }
            ]
        })

        const text = completion.choices[0]?.message?.content || ''
        console.log("raw output: ",text)

        //try parsing safely
        const parsed = safeParseJSON(text)

        //avoid null
        if (!parsed) {
            console.log('Could not parse LLM output:')
            console.log(text)

            return buildFallbackAnalysis(articleText, 'LLM returned invalid JSON, so a local heuristic analysis was used.')
        }

        return parsed

    } catch (err) {
        console.error('LLM error:', err)
        return buildFallbackAnalysis(articleText, 'LLM analysis failed, so a local heuristic analysis was used.')
    }

}
export function safeParseJSON(text) {
    
    const repaired = repairLikelyJson(text.trim())
  try {
    return JSON.parse(repaired)
  } catch {
    const match = repaired.match(/\{[\s\S]*\}/)
    return match ? JSON.parse(match[0]) : null
  }
}
function repairLikelyJson(text) {
  return text
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/,\s*]/g, ']')
}


export function addHighlights(body, highlights = [], description = 'Potential bias indicator highlighted by the model.') {
    return highlights.map((highlight) => {
        const startIndex = findMatch(body, highlight)

        if (startIndex === -1) {
            return {
                highlight,
                startIndex: null,
                endIndex: null,
                type: 'bias-indicator',
                description
            }
        }

        return {
            highlight,
            startIndex,
            endIndex: startIndex + highlight.length,
            type: 'bias-indicator',
            description
        }
    })
}
function findMatch(body, text) {
  //try exact match
  let index = body.indexOf(text)
  if (index !== -1) return index

  //fallback: remove quotes and retry
  const cleaned = text
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/\s+/g, ' ')
    .trim()
  index = body.indexOf(cleaned)
  if (index !== -1) return index

  return -1
}