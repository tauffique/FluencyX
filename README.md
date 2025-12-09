# FluencySure - AI Language Learning App

A modern, AI-powered language learning application built with Next.js, React, and Tailwind CSS.

## 🚀 Features

- **AI Chatbot** - Practice conversations with intelligent AI
- **Smart Reading Hub** - Curated stories and articles
- **Pronunciation Trainer** - AI-powered speech recognition
- **Writing Assistant** - Grammar and style corrections
- **Advanced Flashcards** - Spaced repetition learning
- **Advanced Analytics** - Track your progress

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **APIs**: OpenAI, Google API, DeepL API
- **Deployment**: Vercel

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (version 18 or higher)
- **npm** or **yarn** or **pnpm**
- A code editor (VS Code recommended)

## 🔧 Installation & Setup

### Step 1: Clone or Download the Project

If you received this as a folder, open it in VS Code. Otherwise:

```bash
# Navigate to the project folder
cd linguaflow-app
```

### Step 2: Install Dependencies

Open the terminal in VS Code (Terminal > New Terminal) and run:

```bash
npm install
```

Or if you prefer yarn:

```bash
yarn install
```

Or if you prefer pnpm:

```bash
pnpm install
```

This will install all necessary packages (Next.js, React, Tailwind CSS, etc.)

### Step 3: Set Up Environment Variables

1. Copy the example environment file:

```bash
cp .env.local.example .env.local
```

2. Open `.env.local` and add your API keys:

```env
# OpenAI API Key
OPENAI_API_KEY=sk-your-openai-key-here

# Google API Key
GOOGLE_API_KEY=your-google-api-key-here

# DeepL API Key
DEEPL_API_KEY=your-deepl-api-key-here
```

**Note**: You can skip adding API keys for now if you just want to see the UI. The app will work without them for the landing page.

### Step 4: Run the Development Server

```bash
npm run dev
```

Or with yarn:

```bash
yarn dev
```

Or with pnpm:

```bash
pnpm dev
```

### Step 5: Open in Browser

Open your browser and navigate to:

```
http://localhost:3000
```

You should see the landing page! 🎉

## 📁 Project Structure

```
linguaflow-app/
├── app/
│   ├── onboarding/          # Onboarding flow pages
│   │   ├── language/        # Step 1: Language selection
│   │   ├── level/           # Step 2: Level assessment
│   │   ├── goals/           # Step 3: Daily goals
│   │   └── interests/       # Step 4: Topics selection
│   ├── dashboard/           # Main dashboard
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Landing page
├── components/              # Reusable components
│   └── ui/                  # UI components
├── public/                  # Static assets
├── .env.local              # Environment variables (create this)
├── .env.local.example      # Environment template
├── next.config.js          # Next.js configuration
├── tailwind.config.js      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Dependencies

```

## 🎨 Customization

### Change Colors

Edit `tailwind.config.js` to customize the color palette:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        // Your custom colors here
      },
    },
  },
}
```

### Change Fonts

The app uses:
- **Sora** for headings
- **Space Grotesk** for body text

You can change these in `app/globals.css`.

## 🔑 Getting API Keys

### OpenAI API
1. Go to https://platform.openai.com/
2. Sign up or log in
3. Navigate to API keys section
4. Create a new API key

### Google API (for Translation/TTS)
1. Go to https://console.cloud.google.com/
2. Create a new project
3. Enable the Cloud Translation API and Text-to-Speech API
4. Create credentials (API key)

### DeepL API
1. Go to https://www.deepl.com/pro-api
2. Sign up for a free or paid account
3. Copy your API key from the dashboard

## 🚀 Deployment to Vercel

### Option 1: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Option 2: Deploy via Vercel Dashboard

1. Push your code to GitHub
2. Go to https://vercel.com
3. Click "New Project"
4. Import your GitHub repository
5. Add your environment variables
6. Click "Deploy"

## 📝 Development Workflow

1. **Start development server**: `npm run dev`
2. **Make changes**: Edit files and see live updates
3. **Build for production**: `npm run build`
4. **Start production server**: `npm start`

## 🐛 Troubleshooting

### Port 3000 is already in use

```bash
# Kill the process using port 3000
npx kill-port 3000

# Or run on a different port
PORT=3001 npm run dev
```

### Module not found errors

```bash
# Delete node_modules and reinstall
rm -rf node_modules
npm install
```

### Build errors

```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

## 📚 Next Steps

After the landing page is working, we'll build:

1. **Onboarding Flow** (4 steps)
   - Language selection
   - Level assessment
   - Daily goals
   - Interest topics

2. **Dashboard**
   - Main learning hub
   - Feature access
   - Progress tracking

3. **Learning Features**
   - AI Chatbot
   - Reading Hub
   - Pronunciation Trainer
   - Writing Assistant
   - Flashcards
   - Analytics

## 🤝 Support

If you encounter any issues:
1. Check the console for error messages
2. Make sure all dependencies are installed
3. Verify your Node.js version (18+)
4. Clear browser cache and reload

## 📄 License

This project is proprietary and confidential.

---

Built with ❤️ using Next.js and Tailwind CSS
# FluencySure
