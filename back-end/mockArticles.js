const mockArticles = [
        {
    id: "123",
    url: "https://apnews.com/article/nasa-artemis-moon-astronauts-earthset-5ca505933a4c22e6859f15cc100858b6",
    title: "Artemis II's Earthset photo channels Apollo 8's Earthrise shot | AP News",
    source: "apnews.com",
    author: "Marcia Dunn",
    publicationDate: "2026-04-07T14:51:34",
    thumbnail: "https://picsum.photos/seed/artemis/640/420",
    articleText:
        "HOUSTON (AP) — The Artemis II astronauts are now forever intertwined with Apollo 8. A day after the historic lunar flyaround, NASA on Tuesday released striking new photos taken by the U.S.-Canadian crew. The four astronauts channeled Apollo 8’s famous Earthrise shot from 1968 with their own: Earthset, showing our planet setting behind the gray, pockmarked moon. Another photo captures the total solar eclipse that occurred when the moon blocked the sun from the crew’s perspective. The three Americans and one Canadian are now headed home, with a splashdown in the Pacific set for Friday.",
    detectedTopic: "Science",
    sentimentLabel: "Positive",
    sentimentScore: 0.8,
    biasLabel: "Center",
    biasScore: 0.5,
    confidenceScore: 0.9,
    explanation:
        "The article presents the Artemis II mission positively as an important milestone in space exploration and uses celebratory language around the released images.",
    evidenceLines: [
        {
        highlight: "NASA on Tuesday released striking new photos taken by the U.S.-Canadian crew.",
        startIndex: 96,
        endIndex: 173
        },
        {
        highlight: "The four astronauts channeled Apollo 8’s famous Earthrise shot from 1968 with their own: Earthset, showing our planet setting behind the gray, pockmarked moon.",
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
  title: "Canada’s Artemis II astronaut gives thumbs-up to ‘Project Hail Mary’ starring Canadian Ryan Gosling",
  source: "apnews.com",
  author: "Marcia Dunn",
  publicationDate: "2026-04-04",
  thumbnail: "https://picsum.photos/seed/artemis-gosling/640/420",
  articleText: "The new space movie Project Hail Mary starring Ryan Gosling is receiving strong praise as Artemis II astronauts prepare for their lunar mission. Canadian astronaut Jeremy Hansen said the crew watched the film with their families before launch and described it as a real treat. Gosling, also Canadian, sent well wishes to the astronauts ahead of liftoff. Hansen reflected on the connection between science and storytelling, calling the film inspirational and highlighting its message of perseverance and saving humanity. Hansen is the first non-U.S. citizen to travel to the moon.",
  
  detectedTopic: "Science",
  sentimentLabel: "Positive",
  sentimentScore: 0.7,
  biasLabel: "Center",
  biasScore: 0.5,
  confidenceScore: 0.9,
  explanation: "The article focuses on a positive and inspirational connection between a space mission and a science-themed film, highlighting achievements and optimism without political framing.",

  evidenceLines: [
    {
      startIndex: 91,
      endIndex: 170
    },
    {
      startIndex: 300,
      endIndex: 420
    }
  ],

  submittedBy: 1,
  createdAt: new Date()
}
]

export default mockArticles