export const mockArticles = [
  {
    // Unique identifier for the article
    "id": "article_1001",
    
    // Header & Meta information
    "sourceName": "KNOWLEDGE KITCHEN PRESS", // The publisher or media outlet
    "title": "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
    "author": "Mumu Li", // Author of the article
    "publishDate": "02-25-2026",
    "coverImageUrl": "https://dummyimage.com/600x400/cccccc/ffffff&text=News+Image", // Placeholder cover image
    "isBookmarked": true, // Determines if the star icon is filled (saved by user)

    // Bias and Sentiment Analysis Data
    "analysis": {
      "bias": {
        "label": "CENTER-LEFT", // Text displayed above the slider
        "score": -0.3 // Range: -1.0 (Far Left) to 1.0 (Far Right), 0 is Neutral. Used to position the triangle on the slider.
      },
      "sentiment": {
        "label": "NEUTRAL", 
        "score": 0.0 // Range: -1.0 (Negative) to 1.0 (Positive). Used to position the triangle on the slider.
      }
    },

    // Content for the List View
    "summary": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, ....", // Short snippet for the list card

    // Content for the Detail View (Pure Text + Highlight Indices)
    "content": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    
    // Array of objects defining which parts of the 'content' string should be highlighted
    "highlights": [
      {
        "startIndex": 71, // The character index where the highlight begins (inclusive)
        "endIndex": 147,  // The character index where the highlight ends (exclusive)
        "type": "bias-indicator", // We want different background colors later (see https://owl.purdue.edu/owl/general_writing/academic_writing/logic_in_argumentative_writing/fallacies.html)
        "description": "This phrase indicates a center-left leaning bias." // We want to show a tooltip when tapping the highlight
      }
    ]
  },
  {
    "id": "article_1002",
    "sourceName": "GLOBAL NEWS NETWORK",
    "title": "Understanding the global economic shifts in early 2026",
    "author": "Alex Smith",
    "publishDate": "2026-03-15",
    "coverImageUrl": "https://dummyimage.com/600x400/e0e0e0/000000&text=Economy+News",
    "isBookmarked": false,
    "analysis": {
      "bias": {
        "label": "CENTER-RIGHT",
        "score": 0.4
      },
      "sentiment": {
        "label": "POSITIVE",
        "score": 0.6
      }
    },
    "summary": "A deep dive into the recent market trends and what they mean for international trade agreements moving forward...",
    "content": "A deep dive into the recent market trends and what they mean for international trade agreements moving forward. Experts suggest that the new policies will heavily favor corporate deregulation, which has sparked a massive debate among policymakers. While some argue it will boost the GDP, others fear it will widen the wealth gap.",
    "highlights": [
      {
        "startIndex": 136, 
        "endIndex": 182,  // Highlights: "heavily favor corporate deregulation"
        "type": "bias-indicator",
        "description": "Right-leaning economic policy framing."
      }
    ]
  }
];
