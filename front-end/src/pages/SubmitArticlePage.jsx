//submit article view
import { useState } from 'react'
import './SubmitArticlePage.css'
import { useNavigate } from 'react-router-dom'

export default function SubmitArticlePage(){
    const navigate = useNavigate()
    const [url, setUrl] = useState('')
    const [title, setTitle] = useState('')


    const handleSubmit = (e) => {
        e.preventDefault()
        if (!url) {
            alert("Please enter a URL")
            return
        }   // req to backend here if valid url
        navigate('/success', {
            state: {
            title: title || url   
            }
        })

    }
    return <div className="submit-page">
        <button className="back-button" onClick={() => navigate('/my-articles')}> &#8656; Back</button>
        
        <div className="submit-title">Submit an Article</div>
        <div className="submit-subtitle">Get bias and sentiment analysis</div>

        <div className="submit-card">
            <div className="card-title">Article Details</div>
            <div className="card-subtitle">Enter the url of a news article to analyze</div>
            <form className="submit-form" onSubmit={handleSubmit}>
                <input
                    className="submit-input"
                    placeholder="Article URL"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                />
                
                <input
                    className="submit-input"
                    placeholder="Title (optional)"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <button className="submit-button" type="submit" disabled={!url}>ANALYZE</button>
            </form>
        </div>
    </div>
}