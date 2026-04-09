import 'dotenv/config'
import OpenAI from 'openai'

let missingKeyWarned = false
const TARGET_HIGHLIGHT_COUNT = 10
const STOP_WORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'but', 'if', 'then', 'than', 'that', 'this', 'these', 'those',
  'to', 'of', 'in', 'on', 'for', 'with', 'from', 'as', 'at', 'by', 'it', 'its', 'is', 'are',
  'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'not', 'no',
  'can', 'could', 'would', 'should', 'may', 'might', 'will', 'just', 'also', 'about', 'over',
  'after', 'before', 'during', 'into', 'out', 'up', 'down', 'their', 'there', 'they', 'them',
  'you', 'your', 'we', 'our', 'he', 'she', 'his', 'her', 'who', 'whom', 'which', 'what', 'when',
  'where', 'why', 'how', 'all', 'any', 'some', 'many', 'most', 'more', 'less', 'very'
])

const HEURISTIC_TAXONOMY_RULES = [
  {
    taxonomyTag: 'affective-manipulation',
    reason: 'Uses emotionally charged wording to push a reaction over evidence.',
    patterns: [/\bdevastating\b/i, /\bhorrifying\b/i, /\bshocking\b/i, /\bpanic\b/i, /\bcrisis\b/i, /\boutrageous\b/i]
  },
  {
    taxonomyTag: 'lexical-distortion',
    reason: 'Uses editorialized verbs or adjectives instead of neutral description.',
    patterns: [/\bsmugly\b/i, /\bblasted\b/i, /\bslammed\b/i, /\bboasted\b/i, /\bcomplained\b/i, /\bfurious\b/i]
  },
  {
    taxonomyTag: 'vague-attribution',
    reason: 'Relies on vague attribution without naming verifiable sources.',
    patterns: [/\bcritics say\b/i, /\bmany believe\b/i, /\bsome say\b/i, /\bsources say\b/i, /\bit is believed\b/i, /\bobservers say\b/i]
  },
  {
    taxonomyTag: 'evidentiary-void',
    reason: 'States certainty without accompanying evidence in the same passage.',
    patterns: [/\bclearly\b/i, /\bobviously\b/i, /\bundeniably\b/i, /\bwithout a doubt\b/i, /\binarguably\b/i]
  },
  {
    taxonomyTag: 'speculative-projection',
    reason: 'Frames future speculation as if it were guaranteed.',
    patterns: [/\bwill inevitably\b/i, /\bis bound to\b/i, /\bwill certainly\b/i, /\bno doubt will\b/i, /\bwill lead to\b/i]
  },
  {
    taxonomyTag: 'binary-forcing',
    reason: 'Forces a complex issue into two extreme and exclusive options.',
    patterns: [/\beither\b.*\bor\b/i, /\bonly two choices\b/i, /\bno middle ground\b/i, /\bwith us or against us\b/i]
  },
  {
    taxonomyTag: 'reductive-framing',
    reason: 'Oversimplifies opposing positions into easy-to-dismiss caricatures.',
    patterns: [/\bjust wants? to\b/i, /\ball they want is\b/i, /\bthe opposition just\b/i, /\bsimply wants?\b/i]
  },
  {
    taxonomyTag: 'ad-hominem-attack',
    reason: 'Attacks a person instead of addressing the substance of argument.',
    patterns: [/\bcan'?t trust\b/i, /\bbecause (he|she|they) (was|were)\b/i, /\bdisqualified because\b/i, /\bpersonal failure\b/i]
  },
  {
    taxonomyTag: 'false-equivalence',
    reason: 'Treats disproportionate cases as if they were equivalent.',
    patterns: [/\bjust as bad as\b/i, /\bno different than\b/i, /\bequally as bad as\b/i, /\bthe same as\b/i]
  },
  {
    taxonomyTag: 'prescriptive-imperative',
    reason: 'Directs readers toward a required conclusion instead of analysis.',
    patterns: [/\byou must\b/i, /\bwe must\b/i, /\bonly one right side\b/i, /\bthere is only one\b/i]
  }
]

const HIGHLIGHT_TAXONOMY = {
  'affective-manipulation': {
    label: 'Affective Manipulation',
    colorHex: '#F4A7AF'
  },
  'lexical-distortion': {
    label: 'Lexical Distortion',
    colorHex: '#F7C9A3'
  },
  'vague-attribution': {
    label: 'Vague Attribution',
    colorHex: '#F3E2A2'
  },
  'evidentiary-void': {
    label: 'Evidentiary Void',
    colorHex: '#CFE7A6'
  },
  'speculative-projection': {
    label: 'Speculative Projection',
    colorHex: '#A9DCD4'
  },
  'binary-forcing': {
    label: 'Binary Forcing',
    colorHex: '#A9E3EE'
  },
  'reductive-framing': {
    label: 'Reductive Framing',
    colorHex: '#AFCDEE'
  },
  'ad-hominem-attack': {
    label: 'Ad Hominem Attack',
    colorHex: '#CFB7E8'
  },
  'false-equivalence': {
    label: 'False Equivalence',
    colorHex: '#F5B2D5'
  },
  'prescriptive-imperative': {
    label: 'Prescriptive Imperative',
    colorHex: '#C8CDD2'
  }
}

const TAXONOMY_KEYS = Object.keys(HIGHLIGHT_TAXONOMY)

function getClient() {
  const apiKey = process.env.GROQ_API_KEY || process.env.OPENAI_API_KEY

  if (!apiKey) {
    if (!missingKeyWarned) {
      missingKeyWarned = true
      console.warn('LLM disabled: set GROQ_API_KEY (or OPENAI_API_KEY) to enable article analysis.')
    }
    return null
  }

  return new OpenAI({
    apiKey,
    baseURL: 'https://api.groq.com/openai/v1'
  })
}

export async function analyzeWithLLM(articleText){
  const taxonomyOptions = TAXONOMY_KEYS.join(' | ')
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
        "evidenceLines": [
          {
            "quote": "exact quote from article",
            "taxonomyTag": "${taxonomyOptions}",
            "reason": "short mechanical explanation"
          }
        ]
        }

        Rules:
        - sentimentScore must be between -1 and 1
        - biasScore must be between -1 and 1, where -1 is most left-leaning and 1 is most right-leaning
        - confidenceScore must be between 0 and 1
        - evidenceLines MUST use exact quotes copied from the article text
        - evidenceLines should only include genuinely problematic fragments
        - Return EXACTLY 10 evidenceLines whenever article length allows
        - Prefer one specific quoted word or very short phrase per sentence
        - Use at least 4 different taxonomyTag values when possible
        - taxonomyTag must be one of: ${taxonomyOptions}
        - reason must explain why the quote fits the taxonomy, in <= 20 words
        - only choose ONE of the options for sentimentLabel
        - only choose ONE of the options for biasLabel
        - only choose ONE of the options for detectedTopic
        - Right means right-wing, republican, conservative; Left means left-wing, democratic, liberal
        - Use only standard ASCII double quotes (") for all JSON strings.
        - Do not use smart quotes.
        - Replace all smart quotes (“ ” ‘ ’) with regular quotes
        - Escape any internal quotes using backslashes (\")
        - output must be a single complete JSON object

        Article:
        """
        ${articleText.slice(0, 3000)}
        """
        `

    try {
      const client = getClient()
      if (!client) {
        return {
          sentimentLabel: 'Unknown',
          sentimentScore: 0,
          biasLabel: 'Unknown',
          detectedTopic: 'Unknown',
          biasScore: 0,
          confidenceScore: 0,
          explanation: 'LLM credentials are not configured.',
          evidenceLines: []
        }
      }

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
        const cleaned = cleanLLMOutput(text)
        const parsed = safeParseJSON(cleaned)

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

            return normalizeAnalysis(parsed, articleText)

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

function normalizeAnalysis(parsed = {}, articleText = '') {
  return {
    ...parsed,
    evidenceLines: normalizeEvidenceLines(parsed.evidenceLines, articleText)
  }
}

function normalizeEvidenceLines(evidenceLines = [], articleText = '') {
  if (!Array.isArray(evidenceLines)) return []

  const normalized = evidenceLines
    .map((entry) => {
      const quote = typeof entry === 'string'
        ? entry
        : (entry?.quote || entry?.highlight || entry?.text || '')

      if (!quote || typeof quote !== 'string') return null

      const rawTag = typeof entry === 'object' ? entry.taxonomyTag : null
      const taxonomyTag = TAXONOMY_KEYS.includes(rawTag)
        ? rawTag
        : 'lexical-distortion'

      const taxonomy = HIGHLIGHT_TAXONOMY[taxonomyTag]

      return {
        quote: quote.trim(),
        taxonomyTag,
        taxonomyLabel: taxonomy.label,
        colorHex: taxonomy.colorHex,
        reason: typeof entry === 'object' && typeof entry.reason === 'string'
          ? entry.reason.trim()
          : ''
      }
    })
    .filter(Boolean)

  return expandEvidenceCoverage(normalized, articleText)
}

function expandEvidenceCoverage(existingLines = [], articleText = '') {
  const working = existingLines
    .map((line) => sanitizeLine(line))
    .filter(Boolean)

  if (working.length >= TARGET_HIGHLIGHT_COUNT) {
    return working.slice(0, TARGET_HIGHLIGHT_COUNT)
  }

  if (!articleText || typeof articleText !== 'string') {
    return working.slice(0, TARGET_HIGHLIGHT_COUNT)
  }

  const generated = buildSentenceDrivenHighlights(articleText)
  const seen = new Set(working.map((line) => `${normalizeForKey(line.quote)}|${line.taxonomyTag}`))

  for (const line of generated) {
    if (working.length >= TARGET_HIGHLIGHT_COUNT) break
    const key = `${normalizeForKey(line.quote)}|${line.taxonomyTag}`
    if (seen.has(key)) continue
    seen.add(key)
    working.push(line)
  }

  // Last resort: duplicate sentence words with alternating taxonomy to guarantee 10 visible highlights.
  let fillerIndex = 0
  const fillerTaxonomy = ['lexical-distortion', 'vague-attribution', 'evidentiary-void', 'speculative-projection']
  const fillerWords = extractCandidateWords(articleText)
  while (working.length < TARGET_HIGHLIGHT_COUNT && fillerWords.length > 0) {
    const word = fillerWords[fillerIndex % fillerWords.length]
    const tag = fillerTaxonomy[fillerIndex % fillerTaxonomy.length]
    working.push(createTaxonomyLine(word, tag, 'Sentence-level cue selected to increase annotation coverage.'))
    fillerIndex += 1
  }

  return working.slice(0, TARGET_HIGHLIGHT_COUNT)
}

function classifySentence(sentence) {
  for (const rule of HEURISTIC_TAXONOMY_RULES) {
    const matchedPattern = rule.patterns.find((pattern) => pattern.test(sentence))
    if (matchedPattern) {
      const match = sentence.match(matchedPattern)
      const quote = match?.[0] || extractSpecificWord(sentence) || sentence
      return createTaxonomyLine(quote, rule.taxonomyTag, rule.reason)
    }
  }

  if (/\b(always|never|everyone|nobody|must|cannot|can't)\b/i.test(sentence)) {
    const quote = extractSpecificWord(sentence) || sentence
    return createTaxonomyLine(quote, 'evidentiary-void', 'Uses absolute certainty language without immediate proof.')
  }

  return null
}

function createTaxonomyLine(quote, taxonomyTag, reason) {
  const taxonomy = HIGHLIGHT_TAXONOMY[taxonomyTag] || HIGHLIGHT_TAXONOMY['lexical-distortion']
  return {
    quote: quote.trim(),
    taxonomyTag,
    taxonomyLabel: taxonomy.label,
    colorHex: taxonomy.colorHex,
    reason
  }
}

function splitIntoSentences(text) {
  return text
    .split(/(?<=[.!?])\s+/)
    .map((part) => part.trim())
    .filter((part) => part.length >= 8 && part.length <= 320)
}

function normalizeForKey(text = '') {
  return text.toLowerCase().replace(/\s+/g, ' ').trim()
}

function sanitizeLine(line) {
  if (!line || !line.quote || typeof line.quote !== 'string') return null
  const taxonomyTag = TAXONOMY_KEYS.includes(line.taxonomyTag)
    ? line.taxonomyTag
    : 'lexical-distortion'
  const taxonomy = HIGHLIGHT_TAXONOMY[taxonomyTag]
  return {
    quote: line.quote.trim(),
    taxonomyTag,
    taxonomyLabel: taxonomy.label,
    colorHex: taxonomy.colorHex,
    reason: typeof line.reason === 'string' && line.reason.trim()
      ? line.reason.trim()
      : 'Potential framing cue.'
  }
}

function buildSentenceDrivenHighlights(articleText) {
  const sentences = splitIntoSentences(articleText)
  const results = []
  const usedWords = new Set()

  // Pass 1: rule-based taxonomy hits.
  for (const sentence of sentences) {
    if (results.length >= TARGET_HIGHLIGHT_COUNT) break
    const classified = classifySentence(sentence)
    if (!classified) continue
    const sanitized = sanitizeLine(classified)
    if (!sanitized) continue
    usedWords.add(normalizeForKey(sanitized.quote))
    results.push(sanitized)
  }

  // Pass 2: one specific word per sentence.
  for (const sentence of sentences) {
    if (results.length >= TARGET_HIGHLIGHT_COUNT) break
    const word = extractSpecificWord(sentence, usedWords)
    if (!word) continue
    usedWords.add(normalizeForKey(word))
    results.push(createTaxonomyLine(word, 'lexical-distortion', 'Specific lexical choice that can influence interpretation.'))
  }

  // Pass 3: article-wide candidates if sentence pass is still short.
  for (const word of extractCandidateWords(articleText)) {
    if (results.length >= TARGET_HIGHLIGHT_COUNT) break
    const key = normalizeForKey(word)
    if (!key || usedWords.has(key)) continue
    usedWords.add(key)
    results.push(createTaxonomyLine(word, 'evidentiary-void', 'Claim-support signal selected for denser review coverage.'))
  }

  return results.slice(0, TARGET_HIGHLIGHT_COUNT)
}

function extractSpecificWord(sentence, usedWords = new Set()) {
  const words = sentence.match(/\b[A-Za-z][A-Za-z'-]{2,}\b/g) || []

  const prioritized = words
    .map((word) => word.trim())
    .filter((word) => !STOP_WORDS.has(word.toLowerCase()))
    .sort((a, b) => b.length - a.length)

  for (const word of prioritized) {
    const key = normalizeForKey(word)
    if (!usedWords.has(key)) {
      return word
    }
  }

  return prioritized[0] || null
}

function extractCandidateWords(text) {
  const words = text.match(/\b[A-Za-z][A-Za-z'-]{3,}\b/g) || []
  return words
    .map((word) => word.trim())
    .filter((word) => !STOP_WORDS.has(word.toLowerCase()))
}

function cleanLLMOutput(text) {
  return text
    .replace(/\n/g, ' ')     // remove newlines
    .trim()
}
export function safeParseJSON(text) {
  if (!text || typeof text !== 'string') return null

  const candidates = buildParseCandidates(text)
  for (const candidate of candidates) {
    try {
      return JSON.parse(candidate)
    } catch {
      // Keep trying the next repaired candidate.
    }
  }

  return null
}

function buildParseCandidates(text) {
  const trimmed = text.trim()
  const extracted = extractFirstJsonObject(trimmed)

  const candidates = new Set()
  const push = (value) => {
    if (value && typeof value === 'string') {
      candidates.add(value)
    }
  }

  push(trimmed)
  push(extracted)
  push(repairLikelyJson(trimmed))
  push(repairLikelyJson(extracted))

  return Array.from(candidates)
}

function extractFirstJsonObject(text) {
  const match = text.match(/\{[\s\S]*\}/)
  return match ? match[0] : text
}

function repairLikelyJson(text) {
  return text
    .replace(/```json\s*/gi, '')
    .replace(/```/g, '')
    .replace(/,\s*]/g, ']')
    .replace(/,\s*}/g, '}')
    .trim()
}

//finds the index of each quote to the article body text, for highlighting later in frontend
export function addHighlights(body, highlights=[]){
  let searchCursor = 0

  return highlights.map((highlight) => {
        const quote = typeof highlight === 'string'
          ? highlight
          : (highlight?.quote || highlight?.highlight || '')

        const taxonomyTag = typeof highlight === 'object' && TAXONOMY_KEYS.includes(highlight.taxonomyTag)
          ? highlight.taxonomyTag
          : 'lexical-distortion'

        const taxonomy = HIGHLIGHT_TAXONOMY[taxonomyTag]
        if (!quote || typeof quote !== 'string') {
          return {
            highlight: '',
            quote: '',
            taxonomyTag,
            taxonomyLabel: taxonomy.label,
            colorHex: taxonomy.colorHex,
            reason: typeof highlight === 'object' && typeof highlight.reason === 'string' ? highlight.reason.trim() : '',
            startIndex: null,
            endIndex: null
          }
        }
        let startIndex = findMatch(body, quote, searchCursor)
        if (startIndex === -1) {
          startIndex = findMatch(body, quote, 0)
        }

        if (startIndex === -1) {
        return {
            highlight: quote,
            quote,
            taxonomyTag,
            taxonomyLabel: taxonomy.label,
            colorHex: taxonomy.colorHex,
            reason: typeof highlight === 'object' && typeof highlight.reason === 'string' ? highlight.reason.trim() : '',
            startIndex: null,
            endIndex: null
        }
        }
        const mappedHighlight = {
          highlight: quote,
          quote,
          taxonomyTag,
          taxonomyLabel: taxonomy.label,
          colorHex: taxonomy.colorHex,
          reason: typeof highlight === 'object' && typeof highlight.reason === 'string' ? highlight.reason.trim() : '',
          startIndex,
          endIndex: startIndex + quote.length
        }

        searchCursor = mappedHighlight.endIndex
        return mappedHighlight
    })
}
function findMatch(body, text, fromIndex = 0) {
  //try exact match
  let index = body.indexOf(text, Math.max(0, fromIndex))
  if (index !== -1) return index

  //fallback: remove quotes and retry
  const cleaned = text
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/\s+/g, ' ')
    .trim()
  index = body.indexOf(cleaned, Math.max(0, fromIndex))
  if (index !== -1) return index

  return -1
}

