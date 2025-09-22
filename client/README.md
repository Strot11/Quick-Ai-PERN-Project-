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
- **Responsive Sidebar Navigation** with active link highlighting and mobile sidebar toggle.
- **User Authentication** (Clerk integration) with user profile and plan display.
- **Modern UI** with Tailwind CSS and custom font (Outfit).
- **Dashboard:** Shows total creations, active plan, and recent creations.
- **Article Generator:** Select topic and length, generate articles.
- **Image Generator:** Describe image, select style, publish option.
- **Testimonials:** User feedback with star ratings.
- **Reusable Components:** Navbar, Hero, Footer, Plan, Sidebar, Testimonial, CreationItem.

## Folder Structure

```
src/
  components/
    Aitools.jsx
    creationItem.jsx
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
  index.css
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
- Generate articles and images using AI.
- View your dashboard for stats and recent creations.
- Enjoy seamless content creation with AI!

## Customization

- **Styling:** Uses Tailwind CSS and the Outfit font.
- **Sidebar:** Responsive with mobile toggle and active link styles.
- **Dashboard:** Displays user plan using Clerk's `<Protect>` component.
- **Components:** Easily extendable for new AI tools.

## License

MIT
