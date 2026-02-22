# Reminisce - Contextual Note Taker

Reminisce is a beautifully crafted, full-stack note-taking application designed to help you capture memories, ideas, and tasks within specific contexts. Built with a focus on typography and clean design, it provides a distraction-free environment for your thoughts.

![Reminisce Preview](https://picsum.photos/seed/reminisce/1200/600)

## ✨ Features

- **Context-Based Organization**: Categorize your notes into Meetings, Ideas, Projects, Feelings, Events, and more.
- **Markdown Support**: Write using full Markdown syntax with a live preview mode.
- **Custom Typography**: Choose from Modern Sans, Classic Serif, Elegant Display, or Technical Mono fonts.
- **Color Themes**: Personalize your notes with curated ink colors (Ink Black, Deep Sepia, Ocean Blue, Forest Green, and Dusty Rose).
- **Full-Stack Persistence**: Notes are stored in a local SQLite database, ensuring your data stays on your machine.
- **Responsive Design**: Works seamlessly on mobile and desktop devices.
- **Search**: Quickly find any note by title or content.

## 🚀 Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS, Lucide React, Motion (Framer Motion).
- **Backend**: Node.js, Express.
- **Database**: SQLite (via `better-sqlite3`).
- **Styling**: Tailwind CSS 4.0.

## 🛠️ Installation & Local Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- npm (comes with Node.js)

### Steps
1. **Clone the repository** (or download the files):
   ```bash
   git clone <your-repo-url>
   cd reminisce
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run in development mode**:
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:3000`.

## 📦 Deployment

This is a full-stack application. To deploy it:

1. **Build the frontend**:
   ```bash
   npm run build
   ```

2. **Environment Variables**:
   - Set `NODE_ENV=production`.
   - If using Gemini AI features, set `GEMINI_API_KEY`.

3. **Hosting**:
   - Use a provider that supports Node.js and **persistent storage** (for the `notes.db` file), such as Railway, Render (with a Disk), or a VPS (DigitalOcean/AWS).

## 📝 License

MIT License - feel free to use this project for your own learning or personal use.
