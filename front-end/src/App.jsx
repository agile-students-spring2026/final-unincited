import './App.css'
import { BrowserRouter as Router, Routes, Route, useLocation} from 'react-router-dom'

import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import DashboardPage from './pages/DashboardPage'
import AnalyticsPage from './pages/AnalyticsPage'
import AboutPage from './pages/AboutPage'
import MyArticlesPage from './pages/MyArticlesPage'
import SubmitArticlePage from './pages/SubmitArticlePage'
import SubmitSuccessPage from './pages/SubmitSuccessPage'
import ArticlePage from './pages/ArticlePage'

import Nav from './components/Nav'


function AppLayout() {
  const location = useLocation()

  const hideNavRoutes = ["/", "/signup", "/forgot-password"];
  const hideNav = hideNavRoutes.includes(location.pathname);
  //need to create path for article detail page 
  return (
    <>
      <Routes>
        
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/submit" element={<SubmitArticlePage />} />
        <Route path="/success" element={<SubmitSuccessPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/my-articles" element={<MyArticlesPage />} />
        <Route path="/article/:id" element={<ArticlePage />} />
        
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
