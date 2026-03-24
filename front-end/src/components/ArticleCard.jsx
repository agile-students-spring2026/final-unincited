//article cards for dashboard and myarticles page
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import './ArticleCard.css'


function ArticleCard({ id, source, title, summary, date, sentiment, bias, thumbnail, isBookmarked}) {

  const [saved, setSaved] = useState(isBookmarked);
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/article/${id}`);
  };
  
  return (
        
    <div className="article-card" onClick={handleClick}>
      <img className="article-thumbnail" src={thumbnail} alt={title} />
      
      <div className="article-content">
        <div className="article-meta">
          <span className="source">{source}</span>
        
          <button 
            className={`save-button ${saved ? "saved" : ""}`}
            onClick={(e) => {
              e.stopPropagation();
              setSaved(!saved);
            }}
          >
            {saved ? "★" : "☆"}
          </button>

        </div>

        <h3 className="article-title">{title}</h3>
        <p className="article-summary">{summary}</p>

        <div className="article-footer">
          <span className="date">{date}</span>
          <div className="article-tags">
              <span className={`tag sentiment ${sentiment.toLowerCase()}`}>
                {sentiment}
              </span>

              <span className={`tag bias ${bias.toLowerCase()}`}>
                {bias}
              </span>
            
          </div>
        </div>
      </div>

    </div>
  );
}
export default ArticleCard