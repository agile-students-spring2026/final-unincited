const POSTS_API_URL = "https://dummyjson.com/posts?limit=24";
const USERS_API_URL = "https://randomuser.me/api/?results=24&nat=us,ca,au,gb";

const toLabel = (score, type) => {
  if (type === "sentiment") {
    if (score > 0.2) return "POSITIVE";
    if (score < -0.2) return "NEGATIVE";
    return "NEUTRAL";
  }

  if (score <= -0.7) return "LEFT";
  if (score <= -0.25) return "CENTER-LEFT";
  if (score >= 0.7) return "RIGHT";
  if (score >= 0.25) return "CENTER-RIGHT";
  return "CENTER";
};

const clamp = (num, min, max) => Math.max(min, Math.min(max, num));

const titleCase = (value) =>
  value
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");

const shortText = (value, maxLen = 145) => {
  const trimmed = value.trim();
  if (trimmed.length <= maxLen) {
    return trimmed;
  }

  return `${trimmed.slice(0, maxLen).trimEnd()}...`;
};

const makeHighlight = (content, keyword) => {
  if (!keyword) {
    return [];
  }

  const idx = content.toLowerCase().indexOf(keyword.toLowerCase());
  if (idx === -1) {
    return [];
  }

  return [
    {
      startIndex: idx,
      endIndex: idx + keyword.length,
      type: "bias-indicator",
      description: "Model-highlighted phrase for faster manual review."
    }
  ];
};

const buildSourceName = (user) => {
  const city = user?.location?.city;
  const country = user?.location?.country;
  const seed = city || country || "Global";
  return `${seed.toUpperCase()} WIRE`;
};

const buildArticle = (post, user, index) => {
  const likes = post?.reactions?.likes ?? post?.reactions ?? 0;
  const dislikes = post?.reactions?.dislikes ?? 0;
  const reactionTotal = Math.max(1, likes + dislikes);
  const sentimentScore = clamp((likes - dislikes) / reactionTotal, -1, 1);

  const views = post?.views ?? 200;
  const biasScore = clamp(((views % 100) - 50) / 50, -1, 1);

  const publishDate = new Date(Date.now() - (index + 1) * 86400000).toISOString().slice(0, 10);
  const content = `${post.body} Analysis signals and framing cues were detected by the prototype model.`;
  const keyword = post?.tags?.[0] || post?.title?.split(" ")?.[0] || "";

  return {
    id: `article_${post.id}`,
    sourceName: buildSourceName(user),
    title: titleCase(post.title),
    author: `${user?.name?.first || "Unknown"} ${user?.name?.last || "Author"}`,
    publishDate,
    coverImageUrl: `https://picsum.photos/seed/${post.id}/640/420`,
    isBookmarked: likes % 2 === 0,
    isSubmitted: index % 5 !== 0,
    status: index % 4 === 0 ? "pending" : "analyzed",
    analysis: {
      bias: {
        label: toLabel(biasScore, "bias"),
        score: biasScore
      },
      sentiment: {
        label: toLabel(sentimentScore, "sentiment"),
        score: sentimentScore
      }
    },
    summary: shortText(post.body),
    content,
    highlights: makeHighlight(content, keyword)
  };
};

export async function fetchMockArticles() {
  const [postsRes, usersRes] = await Promise.all([
    fetch(POSTS_API_URL),
    fetch(USERS_API_URL)
  ]);

  if (!postsRes.ok || !usersRes.ok) {
    throw new Error("Unable to fetch mock data from external providers.");
  }

  const postsPayload = await postsRes.json();
  const usersPayload = await usersRes.json();

  const posts = Array.isArray(postsPayload?.posts) ? postsPayload.posts : [];
  const users = Array.isArray(usersPayload?.results) ? usersPayload.results : [];

  return posts.map((post, index) => buildArticle(post, users[index % users.length], index));
}
