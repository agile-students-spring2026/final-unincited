import * as cheerio from 'cheerio'
import { JSDOM } from 'jsdom'
import { Readability } from '@mozilla/readability'

//preprocess article text
export function preprocessText(text) {
  return text
    .replace(/\s+/g, ' ')
    .trim()
}
export function extractMetadata(html, url) { //webscrape title, author, publication date, thumbnail, source
    const $ = cheerio.load(html) 

    const title =
        $('meta[property="og:title"]').attr('content') ||
        $('title').text() ||
        null

    const author =
        $('meta[name="author"]').attr('content') ||
        $('meta[property="article:author"]').attr('content') ||
        null

    const publicationDate =
        $('meta[property="article:published_time"]').attr('content') ||
        $('meta[name="pubdate"]').attr('content') ||
        $('time').attr('datetime') ||
        null
    const rawThumbnail = 
        $('meta[property="og:image"]').attr('content') ||
        $('meta[name="twitter:image"]').attr('content') ||
        $('link[rel="image_src"]').attr('href') ||
        null
    const thumbnail = rawThumbnail ? new URL(rawThumbnail, url).href : null
        

    const source = new URL(url).hostname.replace('www.', '')

    return {
        title,
        author,
        publicationDate,
        thumbnail,
        source
    }
}
//get article content (title, body, excerpt)
export function extractArticleContent(html, url) {
  const dom = new JSDOM(html, { url })
  const reader = new Readability(dom.window.document)
  const article = reader.parse()

  if (!article) {
    return {
      title: null,
      textContent: null,
      excerpt: null
    }
  }

  return {
    title: article.title || null,
    textContent: article.textContent || null
  }
}
