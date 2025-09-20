# QuickAi

QuickAi is a React-based web application offering a suite of AI-powered tools for content creators. Users can write articles, generate images, remove backgrounds/objects, review resumes, and more—all in one place.

## Features

- **Home Page:** Introduction and overview of QuickAi tools.
- **AI Tools:**  
  - Write Article  
  - Blog Titles  
  - Generate Images  
  - Remove Background  
  - Remove Object  
  - Review Resume  
  - Community
- **Responsive Sidebar Navigation**
- **User Authentication** (Clerk integration)
- **Modern UI** with Tailwind CSS

## Folder Structure

```
src/
  components/
    Aitools.jsx
    Footer.jsx
    Hero.jsx
    Navbar.jsx
    Plan.jsx
    sidebar.jsx
    Testimonial.jsx
  pages/
    BlogTitles.jsx
    Community.jsx
    Dashboard.jsx
    GenerateImages.jsx
    Home.jsx
    Layout.jsx
    RemoveBackground.jsx
    RemoveObject.jsx
    ReviewResume.jsx
    WriteArticle.jsx
  App.jsx
  main.jsx
```

## Getting Started

1. **Install dependencies:**
   ```
   npm install
   ```

2. **Set up environment variables:**
   - Create a `.env` file and add your Clerk publishable key:
     ```
     VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
     ```

3. **Run the development server:**
   ```
   npm run dev
   ```

4. **Open in browser:**
   - Visit [http://localhost:3000](http://localhost:3000)

## Tech Stack

- React
- React Router
- Clerk (Authentication)
- Tailwind CSS

## Usage

- Sign in to access AI tools.
- Use the sidebar to navigate between features.
- Enjoy seamless content creation with AI!

## License
