# Backend - News Bias App


## Project Structure
```text
back-end/
  routes/               # API routes
    analyze.js          # LLM analysis call post request, adds to analyzed articles 
    articles.js         # CRUD articles in collection
    auth.js             # authentication routes (login, register, logout)
  services/
    analyzeArticle.js   # LLM prompting and post processing for output
    scrapeArticle.js    # web scrape article details from URL
  app.js                # middleware and route mounting
  server.js             # starts the server
```

## Set-up and Installation
