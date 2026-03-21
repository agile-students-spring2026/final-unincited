import './App.css'
import { BrowserRouter as Router, Routes, Route, useLocation} from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import AnalyticsPage from './pages/AnalyticsPage'
import AboutPage from './pages/AboutPage'
import MyArticlesPage from './pages/MyArticlesPage'
import Nav from './components/Nav'


function AppLayout() {
  const location = useLocation()

  const hideNav = location.pathname === "/"
  //need to create path for article detail page 
  return (
    <>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/my-articles" element={<MyArticlesPage />} />
      
      </Routes>

      {!hideNav && <Nav />}
    </>
  )
}

function App() {
  return (
    <div className="app-container">
      <Router>
        <AppLayout />
      </Router>
    </div>
  )
}


export default App
