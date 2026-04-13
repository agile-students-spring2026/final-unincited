import express from 'express'
import axios from 'axios'
import crypto from 'crypto'
import mockUsers from '../mockUsers.js'
import mockArticles from '../mockArticles.js'


import {preprocessText, extractMetadata, extractArticleContent} from '../services/scrapeArticle.js'
import { analyzeWithLLM, addHighlights} from '../services/analyzeArticle.js'
const router = express.Router()

export function getNormalizedHttpUrl(input) {
    if (!input || typeof input !== 'string') return null

    const trimmed = input.trim()
    const matches = trimmed.match(/https?:\/\/[^\s"'<>`]+/gi)
    const candidate = matches?.length ? matches[matches.length - 1] : trimmed

    try {
        const parsed = new URL(candidate)
        if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
            return null
        }
        return parsed.toString()
    } catch {
        return null
    }
}


router.post('/',async(req,res)=>{
    try {
        const {url, title} = req.body // from user submission

        const sessionUser = req.session?.user
        if (!sessionUser){
            return res.status(401).json({ error: 'Not authenticated.' })
        }
        if (!url) {
            return res.status(400).json({ error: 'URL is required.' })
        }

        const normalizedUrl = getNormalizedHttpUrl(url)
        if (!normalizedUrl) {
            return res.status(400).json({
                error: 'Please provide a valid article URL starting with http:// or https://.'
            })
        }

        //get html of webpage
        const response = await axios.get(normalizedUrl, {
            headers: {
                'User-Agent':
                'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36'
            },
            timeout: 10000
        })
        const html = response.data
        const metadata = extractMetadata(html,normalizedUrl)
        const articleContent = extractArticleContent(html,normalizedUrl)
        const articleText = preprocessText(articleContent.textContent || "")
        if(!articleText){
            return res.status(422).json({error:"could not extract article text from URL"})
        }
        //llm call
        const analysis = await analyzeWithLLM(articleText)
        if (analysis.explanation == "LLM analysis failed."){
            throw new Error("Analysis failed")
        }
        
        const articleObject = {
            id : crypto.randomUUID(),
            url: normalizedUrl,
            title: articleContent.title || metadata.title || title,
            source: metadata.source.slice(0,-4),
            author:metadata.author,
            publicationDate: metadata.publicationDate,
            thumbnail: metadata.thumbnail,
            articleText,
            detectedTopic: analysis?.detectedTopic||null,
            sentimentLabel: analysis?.sentimentLabel||null,
            sentimentScore: analysis?.sentimentScore||0,
            biasLabel: analysis?.biasLabel||null,
            biasScore: analysis?.biasScore ||0,
            confidenceScore: analysis?.confidenceScore||0,
            explanation: analysis?.explanation ||null,
            evidenceLines: addHighlights(articleText, analysis?.evidenceLines ||[]),
            submittedBy: sessionUser.id||null,
            createdAt: new Date()
        }
        
        const user = mockUsers.find((u) => u.id === sessionUser.id)
        if (user){ 
            user.submittedArticles.push(articleObject.id)
        }
        // add article to db later
        mockArticles.push(articleObject) 
        return res.status(200).json({
            message: 'Article analyzed successfully.',
            article: articleObject,
            
        })

    }catch (e){
        console.log("error: ",e.message)
        console.error(e)
        //identify types of errors (blocked web scrapers, not found, to send to frontend)
        if (e.response?.status === 401 || e.response?.status === 403) {
            return res.status(422).json({
                error: 'This article source blocked access.',
                details: 'Try another article source like NPR or AP News.'
            })
        }
        if (e.response?.status === 404) {
            return res.status(404).json({
            error: 'Article URL not found.',
            details: 'The provided URL returned 404.'
            })
        }

        return res.status(500).json({
            error: 'Failed to analyze article.',
            details: e.message
        })
    }
    
})

export default router;