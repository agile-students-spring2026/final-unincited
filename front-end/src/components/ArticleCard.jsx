//article cards for dashboard and myarticles page

import './ArticleCard.css'
function ArticleCard({ source, title, summary, date, sentiment, bias }) {
  return (
        
    <div className="article-card">

      <div className="article-meta">
        <span className="source">{source}</span>
        <span className="date">{date}</span>
      </div>

      <h3 className="article-title">{title}</h3>

      <p className="article-summary">{summary}</p>

      <div className="article-tags">
        <span className={`tag sentiment ${sentiment.toLowerCase()}`}>
          {sentiment}
        </span>

        <span className={`tag bias ${bias.toLowerCase()}`}>
          {bias}
        </span>
      </div>

    </div>
  );
}