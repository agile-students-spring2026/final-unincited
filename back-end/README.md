# Backend - News Bias App


## Project Structure
```text
back-end/

  config/ 
    db.js               #connect and disconnect from db configuration file
    jwt-config.js       # set up jwt for authentication
  routes/               # API routes
    analyze.js          # LLM analysis call post request, adds to analyzed articles 
    articles.js         # CRUD articles in collection
    auth.js             # authentication routes (login, register, logout)
  services/
    analyzeArticle.js   # LLM prompting and post processing for output
    scrapeArticle.js    # web scrape article details from URL
  models/               # schemas for article and user collections in database
    Article.js
    User.js
  test/                 # testing files for backend routes and services
  public/               # static files for testing backend connection
  app.js                # middleware and route mounting
  server.js             # starts the server
```

## Set-up and Installation

1. Install dependencies:

```bash
npm install
```

2. Create a local environment file by copying `.env.example` to `.env`.

3. Fill in your own values in `.env`:

- `MONGODB_URI`: MongoDB Atlas connection string for the `unincited` database.
- `MONGODB_URI_TEST` : Database for testing files
- `JWT_SECRET` : JWT secret for authenticating users
- `JWT_EXP_DAYS`: Token expiration
- `CLIENT_URL`: front-end URL (default `http://localhost:5173`).
- `PORT`: API port (default `3000`).

4. Start the backend:

```bash
npm run dev
```

When startup is successful, the server logs `MongoDB connected` and then the port message.
