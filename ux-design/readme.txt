
## 1.0 Login

**Screen Title:** Sign In

**Purpose:**  
Entry point for returning users to access their account and personalized features.

**Functionality:**
- Email and password input fields
- "Sign In" button navigates to Dashboard (2.0) on tap
- Link to Register screen for new users
- No validation required in prototype - any input accepted

---

## 1.0 Register

**Screen Title:** Create Account

**Purpose:**  
Allows new users to create an account to access the app's features.

**Functionality:**
- Name, email, and password input fields
- "Create Account" button navigates to Dashboard (2.0) on tap
- Link to Login screen for existing users
- No validation required in prototype - any input accepted

---

## 2.0 Dashboard

**Screen Title:** Recent Articles

**Purpose:**  
Main landing screen after login. Displays a feed of recently analyzed news articles with their bias and sentiment scores at a glance.

**Functionality:**
- Scrollable list of article cards
- Each card displays: placeholder image, source name, headline, summary excerpt, date, bias badge, sentiment badge
- **Tap any article card → navigates to Article Detail (2.1)**
- Bottom navigation bar provides access to all main sections

---

## 2.1 Article Detail

**Screen Title:** [Article Headline]

**Purpose:**  
Full view of a single article with detailed bias and sentiment analysis visualization.

**Functionality:**
- Back button returns to previous screen
- Displays source, headline, author, and date
- **Bias Analysis Section:**
  - Horizontal bias meter showing position on Left-to-Right spectrum
  - Sliding indicator shows where article falls on the scale
  - Horizontal sentiment meter showing Negative-to-Positive spectrum
- Numeric bias and sentiment score badges
- Full article text content
- Scrollable content area

---

## 3.0 Bias Charts

**Screen Title:** Bias Analytics

**Purpose:**  
Provides aggregate visual analytics showing bias and sentiment trends across all analyzed articles.

**Functionality:**
- **Bias Distribution Chart:** Bar chart showing count of articles by political leaning category (Left, Center-Left, Center, Center-Right, Right)
- **Sentiment Trend Chart:** Line graph showing sentiment patterns over time
- **Source Breakdown:** List view showing average bias score per news source
- **Quick Stats Grid:** 4 stat cards showing:
  - Total articles analyzed
  - Average bias score
  - Average sentiment score
  - Number of sources tracked
- All charts are static wireframes in prototype

---

## 4.0 My Articles

**Screen Title:** My Articles

**Purpose:**  
Central hub for users to manage their submitted articles awaiting analysis and their saved/bookmarked articles.

**Functionality:**
- **Tab Navigation:**
  - "Submitted" tab - shows articles user has submitted for analysis
  - "Saved" tab - shows articles user has bookmarked from the feed
- **"+ Submit" button → navigates to Submit Article (4.1)**
- **Submitted list items show:**
  - Article title
  - Submission date
  - Status badge (pending/analyzed)
  - **Tap analyzed article → navigates to Article Status (4.2)**
- **Saved list items show:**
  - Article title
  - Source name
  - Bias badge
  - **Tap any saved article → navigates to Article Detail (2.1)**

---

## 4.1 Submit Article

**Screen Title:** Submit an Article

**Purpose:**  
Form for users to submit a news article URL for bias and sentiment analysis.

**Functionality:**
- Article URL input field (required in real app)
- Article title input field (optional - for user reference)
- **"Analyze Article" button → navigates to Article Status (4.2) with success state**
- No actual URL validation or API call in prototype

---

## 4.2 Article Status

**Screen Title:** Submission Status

**Purpose:**  
Confirms successful article submission and displays analysis results when complete.

**Functionality:**
- **Success State (new submission):**
  - Success icon indicator
  - "Submitted!" confirmation message
  - Article title display
  - Bias and sentiment score badges (mock results)
  - "View My Articles" button → navigates to My Articles (4.0)
- **Analyzed State (from My Articles tap):**
  - Same layout with analysis results
- **Pending State:**
  - Pending icon
  - "Analysis in Progress" message
  - Article title and submission date

---

## 5.0 About

**Screen Title:** About

**Purpose:**  
Explains the app's mission, how the analysis works, and provides contact information.

**Functionality:**
- **Sections:**
  - "Our Mission" - Brief description of app purpose
  - "How It Works" - Overview of analysis methodology
  - "Methodology" - Grid of tappable cards linking to detailed methodology pages
  - "Contact" - Email contact information
- **Tap any methodology card → navigates to Methodology Detail (5.1)**

---

## 5.1 Methodology Detail

**Screen Title:** [Methodology Topic Title]

**Purpose:**  
Detailed explanation of specific aspects of the bias/sentiment analysis methodology.

**Functionality:**
- Back button returns to About (5.0)
- Full text content explaining the methodology topic
- **Available methodology pages:**
  1. Bias Detection Methodology
  2. Sentiment Analysis Approach
  3. Data Sources & Updates
  4. Limitations & Considerations
- "Other Topics" section at bottom shows remaining methodology pages
- **Tap any topic card → navigates to that Methodology Detail page**

---

## Global Navigation

**Header Navigation Bar:**
- "NewsBias" brand/logo (taps to Dashboard)
- "Home" → Dashboard (2.0)
- "Charts" → Bias Charts (3.0)
- "My" → My Articles (4.0)
- "About" → About (5.0)
- User avatar icon
- "Out" logout button → returns to Login (1.0)

**Footer:**
- Simple copyright text

---

## Screen Flow Summary

```
Login (1.0) ←→ Register (1.0)
      ↓
Dashboard (2.0) → Article Detail (2.1)
      ↓
Bias Charts (3.0)
      ↓
My Articles (4.0) → Submit Article (4.1) → Article Status (4.2)
      ↓
About (5.0) → Methodology (5.1)
```
