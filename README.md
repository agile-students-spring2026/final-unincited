# News Bias Comparison App


## Description

The News Bias Comparison App is a mobile web application that analyzes political news articles to identify bias in the language and wording used.

The system evaluates word choice, phrases, and patterns of text content to generate a score of biasedness and range from left-leaning to right-leaning. Analyzed articles are displayed on a chart to visualize different news sources and articles for comparison. 



## Product Vision Statement

The goal of this app is to provide interpretable insights into how language influences perceived political bias.

Users will be able to create an account, submit an article for analysis, view recently ranked articles, see a visual bias chart, and open an article to understand why it received its score. Users will also be able to save articles for later.

## Core Team Members

| Member              | GitHub Account                  |
|---------------------|----------------------------------|
| Mumu Li             | [@n3xta](https://github.com/n3xta) |
| Andy Liu            | [@andy8259](https://github.com/andy8259)|
| Dana Pantoja-Campa  | [@danapantoja](https://github.com/danapantoja) |
| Uma Patel           |  [@umapaterl5](https://github.com/umapatel5)|
| Kevin Pham          | [@knp4830](https://github.com/knp4830) |


## Project Background
The spread of news online makes it difficult for users to identify bias in the information they consume. News articles often use subtle word choice, tone, and framing to influence how events are perceived, even when the underlying facts are the same.

With the growing role of social media, individuals are often exposed to information that reinforces existing perspectives. 

The News Bias Comparison App aims to provide users with tools to better understand how bias arises in written content. By analyzing the text and providing meaningful insights to the outcome of the bias and sentiment scores, this application gives users a deeper understanding how language shapes perception and enforce media literacy.

## Building and Testing

### Prerequisites

- Node.js 20+ and npm
- Git

### 1) Clone and install dependencies

From the project root:

1. Install front-end dependencies:
	 - `cd front-end`
	 - `npm install`
2. Install back-end dependencies:
	 - `cd ../back-end`
	 - `npm install`

### 2) Environment variables (back-end)

Create a file at [back-end/.env](back-end/.env) with private values.

- `GROQ_API_KEY` : Required for LLM-powered article analysis
- `MONGODB_URI`: MongoDB Atlas connection string for the `unincited` database.
- `MONGODB_URI_TEST` : Database for testing files
- `JWT_SECRET` : JWT secret for authenticating users
- `JWT_EXP_DAYS`: Token expiration
- `CLIENT_URL`: front-end URL (default `http://localhost:5173`).
- `PORT`: API port (default `3000`).
- `NODE_ENV` : set to 'dev' to run the development database, set to 'test' to run the test database

Do not commit `.env` files or secrets to version control.

### 3) Run the project locally

Start back-end (terminal 1):

- `cd back-end`
- `npm run dev`

Start front-end (terminal 2):

- `cd front-end`
- `npm run dev`

App URLs:

- Front-end: `http://localhost:5173`
- Back-end: `http://localhost:3000`
- Back-end health check: `http://localhost:3000/health`

### 4) Run back-end unit tests

From [back-end](back-end):

1. MUST set env variable `NODE_ENV=test` in an env file
- this allows the test to use a separate database

2. run command:
```bash
npm run test
```

### 5) Run code coverage for back-end (c8)

From [back-end](back-end):

1. MUST set env variable `NODE_ENV=test` in an env file
- this allows the test to use a separate database
2. Run command: 
```bash 
npm run coverage
```

This project uses Mocha + Chai for unit tests and c8 for coverage reporting.

### Implemented Sprint Integration Notes

- Back-end implemented with Express.js.
- Dynamic routes return mock JSON data for auth/articles/analyze flows.
- Static routes return files from [back-end/public](back-end/public):
	- `/`
- Front-end login, sign-up, forgot-password, dashboard, article pages, and submit flow call back-end routes.
- Front-end forms POST to back-end routes:
	- `/auth/login`
	- `/auth/signup`
	- `/auth/reset`
	- `/analyze`


## Other Documentation

1. See the [Sprint Planning instructions](instructions-0d-sprint-planning.md) for the requirements of Sprint Planning for each Sprint.

1. See the [Front-End Development instructions](./instructions-1-front-end.md) for the requirements of the initial Front-End Development.

1. See the [Back-End Development instructions](./instructions-2-back-end.md) for the requirements of the initial Back-End Development.

1. See the [Database Integration instructions](./instructions-3-database.md) for the requirements of integrating a database into the back-end.

1. See the [Deployment instructions](./instructions-4-deployment.md) for the requirements of deploying an app.
