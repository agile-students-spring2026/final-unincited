import 'dotenv/config'
import OpenAI from 'openai'


const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1'
})

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

            return {
                sentimentLabel: 'Unknown',
                sentimentScore: 0,
                biasLabel: 'Unknown',
                detectedTopic: 'Unknown',
                biasScore: 0,
                confidenceScore: 0,
                explanation: 'LLM returned invalid JSON.',
                evidenceLines: []
            }
        }

        return parsed

    } catch (err) {
        console.error('LLM error:', err)
        return {
        sentimentLabel: 'Unknown',
        sentimentScore: 0,
        biasLabel: 'Unknown',
        detectedTopic:'Unknown',
        biasScore: 0,
        confidenceScore: 0,
        explanation: 'LLM analysis failed.',
        evidenceLines: []
        }
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


export function addHighlights(body, highlights=[]){
    return highlights.map((highlight) => {
        const startIndex = findMatch(body,highlight)

        if (startIndex === -1) {
        return {
            highlight,
            startIndex: null,
            endIndex: null
        }
        }
        return {
        highlight,
        startIndex,
        endIndex: startIndex + highlight.length
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