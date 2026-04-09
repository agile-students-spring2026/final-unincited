import 'dotenv/config'
import OpenAI from 'openai'

let missingKeyWarned = false
const TARGET_HIGHLIGHT_COUNT = 10
const MAX_HIGHLIGHT_COUNT = 60
const MAX_PROMPT_CHARS = 12000
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

const validDetectedTopic = ["Politics","Climate","Entertainment","Technology" ,"Education","Business","Sports","Health","Science","General"]
const validBiasLabel = ["Left", "Center-Left", "Center","Center-Right","Right"]
const validSentimentLabel = ["Positive","Neutral","Negative"]
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
  const articleForPrompt = buildArticleContextWindow(articleText)
    const prompt = `
        You are a strict JSON generator. Do NOT include any text outside JSON.
        Return ONLY valid JSON.
        Do not include markdown.
        Do not include explanation outside JSON.
        Do not prefix or suffix the JSON with any text.

        Analyze the article and return EXACTLY this JSON format:

        {
        "sentimentLabel": "${validSentimentLabel}",
        "sentimentScore": number,
        "detectedTopic":"${validDetectedTopic}",
        "biasLabel": "${validBiasLabel}",
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
        - Return at least 10 evidenceLines whenever article length allows
        - Aim for statistical coverage of roughly one highlight per paragraph
        - Spread evidenceLines across the full article (beginning, middle, and end)
        - If section delimiters like [MIDDLE SECTION] appear, treat them as separators and never quote them
        - Prefer one specific quoted word or very short phrase per sentence
        - Use at least 4 different taxonomyTag values when possible
        - taxonomyTag must be one of: ${taxonomyOptions}
        - reason must explain why the quote fits the taxonomy, in <= 20 words
        - sentimentLabel must be one of: ${validSentimentLabel}
        - biasLabel must be one of: ${validBiasLabel}
        - detectedTopic must be one of: ${validDetectedTopic}
        - Right means right-wing, republican, conservative; Left means left-wing, democratic, liberal
        - Use only standard ASCII double quotes (") for all JSON strings.
        - Do not use smart quotes.
        - Replace all smart quotes (“ ” ‘ ’) with regular quotes
        - Escape any internal quotes using backslashes (\")
        - output must be a single complete JSON object

        Article:
        """
        ${articleForPrompt}
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
  const targetCount = getDynamicTargetCount(articleText)
  const working = existingLines
    .map((line) => sanitizeLine(line))
    .filter(Boolean)

  if (!articleText || typeof articleText !== 'string') {
    return working.slice(0, targetCount)
  }

  const paragraphGenerated = buildParagraphDrivenHighlights(articleText, targetCount)
  const sentenceGenerated = buildSentenceDrivenHighlights(articleText, targetCount)
  const merged = []
  const seen = new Set()

  // Keep some original model highlights first, but reserve room for paragraph coverage.
  const existingQuota = Math.min(working.length, Math.ceil(targetCount * 0.6))
  addUniqueLines(merged, seen, working.slice(0, existingQuota), targetCount)
  addUniqueLines(merged, seen, paragraphGenerated, targetCount)
  addUniqueLines(merged, seen, working.slice(existingQuota), targetCount)
  addUniqueLines(merged, seen, sentenceGenerated, targetCount)

  // Last resort: duplicate lexical candidates with alternating taxonomy to guarantee target coverage.
  let fillerIndex = 0
  const fillerTaxonomy = ['lexical-distortion', 'vague-attribution', 'evidentiary-void', 'speculative-projection']
  const fillerWords = extractCandidateWords(articleText)
  while (merged.length < targetCount && fillerWords.length > 0) {
    const word = fillerWords[fillerIndex % fillerWords.length]
    const tag = fillerTaxonomy[fillerIndex % fillerTaxonomy.length]
    addUniqueLines(
      merged,
      seen,
      [createTaxonomyLine(word, tag, buildFallbackReason(tag, word))],
      targetCount
    )
    fillerIndex += 1
    if (fillerIndex > fillerWords.length * 2) break
  }

  return merged.slice(0, targetCount)
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
    reason: normalizeReason(reason, taxonomyTag, quote)
  }
}

function normalizeReason(reason, taxonomyTag, quote = '') {
  if (typeof reason === 'string' && reason.trim()) {
    return reason.trim()
  }
  return buildFallbackReason(taxonomyTag, quote)
}

function buildFallbackReason(taxonomyTag, quote = '') {
  const q = formatQuote(quote)

  if (taxonomyTag === 'affective-manipulation') {
    return `${q}uses emotional intensity that can steer reaction over evidence.`
  }
  if (taxonomyTag === 'lexical-distortion') {
    return `${q}uses evaluative wording rather than neutral description.`
  }
  if (taxonomyTag === 'vague-attribution') {
    return `${q}attributes claims vaguely without a clearly named source.`
  }
  if (taxonomyTag === 'evidentiary-void') {
    return `${q}presents a claim without direct support in nearby text.`
  }
  if (taxonomyTag === 'speculative-projection') {
    return `${q}frames a hypothetical outcome as likely or inevitable.`
  }
  if (taxonomyTag === 'binary-forcing') {
    return `${q}compresses a complex issue into limited opposing options.`
  }
  if (taxonomyTag === 'reductive-framing') {
    return `${q}simplifies an opposing position into a reduced caricature.`
  }
  if (taxonomyTag === 'ad-hominem-attack') {
    return `${q}targets people or identity instead of argument substance.`
  }
  if (taxonomyTag === 'false-equivalence') {
    return `${q}treats unequal situations as if they are equivalent.`
  }
  if (taxonomyTag === 'prescriptive-imperative') {
    return `${q}pushes a required conclusion instead of open analysis.`
  }

  return `${q}contains language that may influence interpretation.`
}

function formatQuote(quote = '') {
  const clean = (quote || '').toString().trim().replace(/\s+/g, ' ')
  if (!clean) return 'This fragment '
  const clipped = clean.length > 52 ? `${clean.slice(0, 49)}...` : clean
  return `"${clipped}" `
}

function splitIntoSentences(text) {
  return text
    .split(/(?<=[.!?])\s+/)
    .map((part) => part.trim())
    .filter((part) => part.length >= 8 && part.length <= 320)
}

function splitIntoParagraphs(text) {
  const rawParagraphs = text
    .split(/\n{2,}/)
    .map((part) => part.trim())
    .filter((part) => part.length >= 20)

  if (rawParagraphs.length > 1) {
    return rawParagraphs
  }

  const sentences = splitIntoSentences(text)
  if (sentences.length === 0) {
    return text.trim() ? [text.trim()] : []
  }

  const estimatedParagraphs = Math.max(1, Math.min(MAX_HIGHLIGHT_COUNT, Math.ceil(sentences.length / 3)))
  const chunkSize = Math.max(1, Math.ceil(sentences.length / estimatedParagraphs))
  const syntheticParagraphs = []

  for (let i = 0; i < sentences.length; i += chunkSize) {
    syntheticParagraphs.push(sentences.slice(i, i + chunkSize).join(' '))
  }

  return syntheticParagraphs
}

function getDynamicTargetCount(articleText = '') {
  const paragraphCount = splitIntoParagraphs(articleText).length
  const clampedParagraphTarget = Math.min(MAX_HIGHLIGHT_COUNT, Math.max(TARGET_HIGHLIGHT_COUNT, paragraphCount))
  return clampedParagraphTarget
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
      : buildFallbackReason(taxonomyTag, line.quote)
  }
}

function buildSentenceDrivenHighlights(articleText, targetCount = getDynamicTargetCount(articleText)) {
  const sentences = splitIntoSentences(articleText)
  const prioritizedSentences = buildCoverageOrderedList(sentences, targetCount * 3)
  const results = []
  const usedWords = new Set()

  // Pass 1: rule-based taxonomy hits.
  for (const sentence of prioritizedSentences) {
    if (results.length >= targetCount) break
    const classified = classifySentence(sentence)
    if (!classified) continue
    const sanitized = sanitizeLine(classified)
    if (!sanitized) continue
    usedWords.add(normalizeForKey(sanitized.quote))
    results.push(sanitized)
  }

  // Pass 2: one specific word per sentence.
  for (const sentence of prioritizedSentences) {
    if (results.length >= targetCount) break
    const word = extractSpecificWord(sentence, usedWords)
    if (!word) continue
    usedWords.add(normalizeForKey(word))
    results.push(createTaxonomyLine(word, 'lexical-distortion', buildFallbackReason('lexical-distortion', word)))
  }

  // Pass 3: article-wide candidates if sentence pass is still short.
  for (const word of extractCandidateWords(articleText)) {
    if (results.length >= targetCount) break
    const key = normalizeForKey(word)
    if (!key || usedWords.has(key)) continue
    usedWords.add(key)
    results.push(createTaxonomyLine(word, 'evidentiary-void', buildFallbackReason('evidentiary-void', word)))
  }

  return results.slice(0, targetCount)
}

function buildParagraphDrivenHighlights(articleText, targetCount) {
  const paragraphs = splitIntoParagraphs(articleText)
  const selectedParagraphs = selectEvenlyDistributedItems(paragraphs, targetCount)
  const results = []
  const usedWords = new Set()
  const usedKeys = new Set()

  for (const paragraph of selectedParagraphs) {
    const paragraphSentences = splitIntoSentences(paragraph)
    let added = null

    for (const sentence of paragraphSentences) {
      const classified = sanitizeLine(classifySentence(sentence))
      if (classified) {
        added = classified
        break
      }
    }

    if (!added) {
      const word = extractSpecificWord(paragraph, usedWords)
      if (!word) continue
      added = createTaxonomyLine(word, 'lexical-distortion', buildFallbackReason('lexical-distortion', word))
    }

    const key = `${normalizeForKey(added.quote)}|${added.taxonomyTag}`
    if (usedKeys.has(key)) continue
    usedWords.add(normalizeForKey(added.quote))
    usedKeys.add(key)
    results.push(added)
  }

  return results
}

function buildCoverageOrderedList(sentences, preferredCount) {
  const spread = selectEvenlyDistributedItems(sentences, preferredCount)
  const spreadSet = new Set(spread)
  const remaining = sentences.filter((sentence) => !spreadSet.has(sentence))
  return [...spread, ...remaining]
}

function selectEvenlyDistributedItems(items = [], count = 0) {
  if (!Array.isArray(items) || items.length === 0) return []
  if (count >= items.length) return [...items]
  if (count <= 0) return []

  const selected = []
  for (let i = 0; i < count; i += 1) {
    const index = Math.floor((i * items.length) / count)
    selected.push(items[index])
  }

  return selected
}

function addUniqueLines(target, seen, candidates, cap) {
  for (const candidate of candidates) {
    if (!candidate || target.length >= cap) break
    const sanitized = sanitizeLine(candidate)
    if (!sanitized) continue
    const key = `${normalizeForKey(sanitized.quote)}|${sanitized.taxonomyTag}`
    if (seen.has(key)) continue
    seen.add(key)
    target.push(sanitized)
  }
}

function buildArticleContextWindow(articleText = '') {
  const text = (articleText || '').trim()
  if (text.length <= MAX_PROMPT_CHARS) {
    return text
  }

  const sectionSize = Math.max(1200, Math.floor((MAX_PROMPT_CHARS - 120) / 3))
  const start = text.slice(0, sectionSize)
  const midStart = Math.max(0, Math.floor(text.length / 2) - Math.floor(sectionSize / 2))
  const middle = text.slice(midStart, midStart + sectionSize)
  const end = text.slice(-sectionSize)

  return `${start}\n...[MIDDLE SECTION]...\n${middle}\n...[END SECTION]...\n${end}`
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

