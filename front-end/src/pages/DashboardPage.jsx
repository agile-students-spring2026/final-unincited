import { useState } from "react";
import './DashboardPage.css'
import ArticleCard from "../components/ArticleCard";

//need to inject mock data for article list
function DashboardPage() {

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBias, setSelectedBias] = useState("All");
  const [selectedSentiment, setSelectedSentiment] = useState("All");

  
  return <div className="dashboard-page">
      <div className="dashboard-title">Recent Articles</div>
      <div className="dashboard-subtitle">Articles with bias analysis</div>
      <div className="articles-list">
          
      </div>

  </div>
}

export default DashboardPage