const mockArticles = [
  {
    id: "123",
    url: "https://apnews.com/article/nasa-artemis-moon-astronauts-earthset-5ca505933a4c22e6859f15cc100858b6",
    title: "Artemis II's Earthset photo channels Apollo 8's Earthrise shot | AP News",
    source: "apnews",
    author: "Marcia Dunn",
    publicationDate: "2026-04-07T14:51:34",
    thumbnail: "https://picsum.photos/seed/artemis/640/420",
    articleText:
      "HOUSTON (AP) — The Artemis II astronauts are now forever intertwined with Apollo 8. A day after the historic lunar flyaround, NASA on Tuesday released striking new photos taken by the U.S.-Canadian crew. The four astronauts channeled Apollo 8's famous Earthrise shot from 1968 with their own: Earthset, showing our planet setting behind the gray, pockmarked moon. Another photo captures the total solar eclipse that occurred when the moon blocked the sun from the crew's perspective. The three Americans and one Canadian are now headed home, with a splashdown in the Pacific set for Friday.",
    detectedTopic: "Science",
    sentimentLabel: "Positive",
    sentimentScore: 0.8,
    biasLabel: "Center",
    biasScore: 0.1,
    confidenceScore: 0.9,
    explanation:
      "The article presents the Artemis II mission positively as an important milestone in space exploration and uses celebratory language around the released images.",
    evidenceLines: [
      {
        quote: "NASA on Tuesday released striking new photos taken by the U.S.-Canadian crew.",
        highlight: "NASA on Tuesday released striking new photos taken by the U.S.-Canadian crew.",
        taxonomyTag: "lexical-distortion",
        taxonomyLabel: "Lexical Distortion",
        colorHex: "#F7C9A3",
        reason: "The adjective 'striking' adds evaluative emphasis beyond neutral event reporting.",
        startIndex: 96,
        endIndex: 173
      },
      {
        quote: "The four astronauts channeled Apollo 8's famous Earthrise shot from 1968 with their own: Earthset, showing our planet setting behind the gray, pockmarked moon.",
        highlight: "The four astronauts channeled Apollo 8's famous Earthrise shot from 1968 with their own: Earthset, showing our planet setting behind the gray, pockmarked moon.",
        taxonomyTag: "affective-manipulation",
        taxonomyLabel: "Affective Manipulation",
        colorHex: "#F4A7AF",
        reason: "'Famous' and vivid scene framing increase emotional resonance in otherwise factual narration.",
        startIndex: 174,
        endIndex: 337
      }
    ],
    submittedBy: "1",
    createdAt: new Date("2026-04-08T00:06:08.427Z")
  },
  {
    id: "artemis-gosling-001",
    url: "https://apnews.com/article/nasa-artemis-astronauts-canada-ryan-gosling-0d9dfc7db4d464eb89a5fe84d878fef1",
    title: "Canada's Artemis II astronaut gives thumbs-up to 'Project Hail Mary' starring Canadian Ryan Gosling",
    source: "apnews",
    author: "Marcia Dunn",
    publicationDate: "2026-04-04",
    thumbnail: "https://picsum.photos/seed/artemis-gosling/640/420",
    articleText: "The new space movie Project Hail Mary starring Ryan Gosling is receiving strong praise as Artemis II astronauts prepare for their lunar mission. Canadian astronaut Jeremy Hansen said the crew watched the film with their families before launch and described it as a real treat. Gosling, also Canadian, sent well wishes to the astronauts ahead of liftoff. Hansen reflected on the connection between science and storytelling, calling the film inspirational and highlighting its message of perseverance and saving humanity. Hansen is the first non-U.S. citizen to travel to the moon.",
    detectedTopic: "Science",
    sentimentLabel: "Positive",
    sentimentScore: 0.7,
    biasLabel: "Center",
    biasScore: 0.1,
    confidenceScore: 0.9,
    explanation: "The article focuses on a positive and inspirational connection between a space mission and a science-themed film, highlighting achievements and optimism without political framing.",
    evidenceLines: [
      {
        quote: "receiving strong praise as Artemis II astronauts prepare for their lunar mission",
        highlight: "receiving strong praise as Artemis II astronauts prepare for their lunar mission",
        taxonomyTag: "lexical-distortion",
        taxonomyLabel: "Lexical Distortion",
        colorHex: "#F7C9A3",
        reason: "'Strong praise' is evaluative wording that frames audience sentiment positively.",
        startIndex: 91,
        endIndex: 170
      },
      {
        quote: "calling the film inspirational and highlighting its message of perseverance and saving humanity",
        highlight: "calling the film inspirational and highlighting its message of perseverance and saving humanity",
        taxonomyTag: "affective-manipulation",
        taxonomyLabel: "Affective Manipulation",
        colorHex: "#F4A7AF",
        reason: "Emotionally charged framing ('inspirational', 'saving humanity') directs reader response.",
        startIndex: 300,
        endIndex: 420
      }
    ],
    submittedBy: 1,
    createdAt: new Date()
  },
  {
  id: "entertainment-variety-001",
  url: "https://variety.com/2026/film/news/streaming-fatigue-box-office-decline-1236000000/",
  title: "Streaming Fatigue and Rising Costs Put Pressure on Hollywood Studios",
  source: "variety",
  author: "Brent Lang",
  publicationDate: "2026-03-28",
  thumbnail: "https://picsum.photos/seed/streamingfatigue/640/420",
  articleText:
    "Hollywood studios are facing mounting challenges as audiences grow weary of an oversaturated streaming market. Industry analysts point to declining box office numbers and rising production costs as warning signs for the entertainment sector. Executives are increasingly concerned that too many platforms and subscription fees are pushing viewers away, while fewer blockbuster hits are failing to offset losses.",
  detectedTopic: "Entertainment",
  sentimentLabel: "Negative",
  sentimentScore: -0.6,
  biasLabel: "Center",
  biasScore: 0.1,
  confidenceScore: 0.88,
  explanation:
    "The article uses cautious and negative language to describe industry challenges, focusing on declining performance and concerns from analysts without strong political framing.",
  evidenceLines: [
    {
      quote: "facing mounting challenges as audiences grow weary of an oversaturated streaming market",
      highlight: "facing mounting challenges as audiences grow weary of an oversaturated streaming market",
      taxonomyTag: "affective-manipulation",
      taxonomyLabel: "Affective Manipulation",
      colorHex: "#F4A7AF",
      reason: "Phrases like 'mounting challenges' and 'grow weary' intensify negative emotional tone.",
      startIndex: 30,
      endIndex: 120
    },
    {
      quote: "declining box office numbers and rising production costs as warning signs",
      highlight: "declining box office numbers and rising production costs as warning signs",
      taxonomyTag: "speculative-projection",
      taxonomyLabel: "Speculative Projection",
      colorHex: "#A9DCD4",
      reason: "'Warning signs' projects future decline from current indicators without direct causal proof.",
      startIndex: 140,
      endIndex: 230
    }
  ],
  submittedBy: "1",
  createdAt: new Date()
}
  
]

export default mockArticles
