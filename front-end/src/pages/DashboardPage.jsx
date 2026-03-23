import { useState } from "react";
import './DashboardPage.css'
import ArticleCard from "../components/ArticleCard";
import { mockArticles } from "../data/mockData"; //TEMPORARY
function DashboardPage() {

  const [searchTerm, setSearchTerm] = useState("");
  
  //need to inject mock data for article list
  //then filter using searchterm
  
  
  
  return <div className="dashboard-page">
      <div className="dashboard-title">Recent Articles</div>
      <div className="dashboard-subtitle">Articles with bias analysis</div>
      
      <div className="dashboard-controls">
        <input
          type="text"
          placeholder="Search articles..."
          className="dashboard-search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="articles-list">
          
          {mockArticles.map((article) => {
            if (article.title.includes(searchTerm)){
              return <ArticleCard
              key={article.id}
              id={article.id}
              source={article.sourceName}
              title={article.title}
              summary={article.summary}
              date={article.publishDate}
              sentiment={article.analysis.sentiment.label}
              bias={article.analysis.bias.label}
              thumbnail={article.coverImageUrl}
            />
            }
            
        })}
        
          
      </div>

  </div>
}

export default DashboardPage