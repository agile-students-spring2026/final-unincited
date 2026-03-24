import { useState } from 'react'
import './SubmitSuccessPage.css'
import { useNavigate, useLocation } from 'react-router-dom'

export default function SubmitSucessPage (){
    const navigate = useNavigate()
    const location = useLocation()

    const title = location.state?.title || 'Untitled Article'
    return <div className="success-page">
        <button className="back-button" onClick={() => navigate('/submit')}> ◀ Back</button>

        <div className="success-card">  
            <img className="success-image" src="/submitted.png" alt="submit-alt"></img>
            <div className="success-title">Submitted!</div>
            <div className="success-subtitle">Submitted Article Title: {title}</div>
        </div>
        <button className="articles-button" onClick={() => navigate('/my-articles')}>VIEW MY ARTICLES </button>
    </div>
}