import './App.css'
import { BrowserRouter as Router, Routes, Route, useLocation} from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import AnalyticsPage from './pages/AnalyticsPage'
import AboutPage from './pages/AboutPage'
import YourArticlesPage from './pages/YourArticlesPage'
<<<<<<< HEAD
=======
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import SignUpPage from "./pages/SignUpPage";
>>>>>>> 0f1031e (add forgot password and recovery email page with navigation)
import Nav from './components/Nav'


function AppLayout() {
  const location = useLocation()

  const hideNav = location.pathname === "/"

  return (
    <>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/your-articles" element={<YourArticlesPage />} />
<<<<<<< HEAD
=======
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/signup" element={<SignUpPage />} />
>>>>>>> 0f1031e (add forgot password and recovery email page with navigation)
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
