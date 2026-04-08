export const mockArticles = [
  {
    id: 'article_1001',
    sourceName: 'KNOWLEDGE KITCHEN PRESS',
    title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
    author: 'Mumu Li',
    publishDate: '2026-02-25',
    coverImageUrl: 'https://dummyimage.com/600x400/cccccc/ffffff&text=News+Image',
    isBookmarked: true,
    analysis: {
      bias: { label: 'CENTER-LEFT', score: -0.3 },
      sentiment: { label: 'NEUTRAL', score: 0.0 }
    },
    summary: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    highlights: [
      {
        startIndex: 71,
        endIndex: 147,
        type: 'bias-indicator',
        description: 'This phrase indicates a center-left leaning bias.'
      }
    ]
  },
  {
    id: 'article_1002',
    sourceName: 'GLOBAL NEWS NETWORK',
    title: 'Understanding the global economic shifts in early 2026',
    author: 'Alex Smith',
    publishDate: '2026-03-15',
    coverImageUrl: 'https://dummyimage.com/600x400/e0e0e0/000000&text=Economy+News',
    isBookmarked: false,
    analysis: {
      bias: { label: 'CENTER-RIGHT', score: 0.4 },
      sentiment: { label: 'POSITIVE', score: 0.6 }
    },
    summary: 'A deep dive into the recent market trends and what they mean for international trade agreements moving forward...',
    content: 'A deep dive into the recent market trends and what they mean for international trade agreements moving forward.',
    highlights: [
      {
        startIndex: 136,
        endIndex: 182,
        type: 'bias-indicator',
        description: 'Right-leaning economic policy framing.'
      }
    ]
  }
]
