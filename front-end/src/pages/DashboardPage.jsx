import { useState } from "react";
import './DashboardPage.css'
import ArticleCard from "../components/ArticleCard";
import { mockArticles } from "../data/mockData";

function DashboardPage() {

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBias, setSelectedBias] = useState("All");
  const [selectedSentiment, setSelectedSentiment] = useState("All");

  
  return <div className="dashboard-page">
      <div className="dashboard-title">Recent Articles</div>
      <div className="dashboard-subtitle">Articles with bias analysis</div>
      <div className="articles-list">
          {mockArticles.map((article) => (
            <ArticleCard
              key={article.id}
              source={article.sourceName}
              title={article.title}
              summary={article.summary}
              date={article.publishDate}
              sentiment={article.analysis.sentiment.label}
              bias={article.analysis.bias.label}
            />
          ))}
      </div>

  </div>
}

export default DashboardPage