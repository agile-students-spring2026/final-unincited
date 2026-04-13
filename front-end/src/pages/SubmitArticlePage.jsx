//submit article view
import { useState } from 'react'
import './SubmitArticlePage.css'
import { useNavigate } from 'react-router-dom'
import { apiRequest } from '../lib/api'

export default function SubmitArticlePage(){
    const navigate = useNavigate()
    const [url, setUrl] = useState('')
    const [title, setTitle] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')


    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        if (!url) {
            alert("Please enter a URL")
            return
        }

        setLoading(true)

        try {

            const authData = await apiRequest('/auth/current-user')
            const user = authData.user

            if (!user) {
                throw new Error('Not authenticated')
            }

            const data = await apiRequest(`/analyze`, {
                method: 'POST',
                body: JSON.stringify({
                  url,
                  title,
                }),
            })


            const analyzedTitle = data?.article?.title || title || url

            navigate('/success', {
                state: {
                  title: analyzedTitle,
                }
            })
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }

    }
    return <div className="submit-page">
        <button className="back-button" onClick={() => navigate('/my-articles')}> ◀ Back</button>
        
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
                <button className="submit-button" type="submit" disabled={!url || loading}>
                  {loading ? 'ANALYZING...' : 'ANALYZE'}
                </button>
            </form>
            {error ? <p>{error}</p> : null}
        </div>
    </div>
}