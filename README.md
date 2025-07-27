# DeathChat

A modern AI-powered chat application built with React, TypeScript, and Tailwind CSS. Features a professional dark theme, conversation management, and seamless OpenRouter API integration.

## ✨ Features

- 🤖 **AI-Powered Conversations** - Powered by DeepSeek via OpenRouter API
- 💬 **Multiple Conversations** - Create, manage, and switch between chat sessions
- 🎨 **Modern UI** - Professional dark theme with gradient effects and glass morphism
- 📱 **Fully Responsive** - Optimized for mobile, tablet, and desktop
- 💾 **Persistent Storage** - Conversations saved locally in browser
- 🎯 **Copy & Format** - Copy messages with enhanced text formatting
- ⚡ **Real-time Typing** - Live typing indicators and smooth animations
- 🚀 **Vercel Ready** - Deploy instantly to https://vercel.com/

## 🛠️ Tech Stack

- ⚡ **Vite** - Fast build tool and development server
- ⚛️ **React 18** - Latest React with TypeScript support
- 🎨 **Tailwind CSS** - Utility-first CSS framework with custom animations
- 🤖 **OpenRouter API** - AI model integration (DeepSeek)
- 📱 **Responsive Design** - Mobile-first approach
-  **ESLint** - Code linting and formatting

## 🚀 Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn
- OpenRouter API key ([Get one here](https://openrouter.ai/))

### Installation

1. Clone the repository:
```bash
git clone https://github.com/SDeath-Scythe/DeathChat.git
cd DeathChat
```

### Deploying to Vercel

1. Push your repository to GitHub (or GitLab/Bitbucket).
2. Go to [Vercel](https://vercel.com/) and import your project.
3. In Vercel dashboard, set the environment variable:
   - `VITE_OPENROUTER_API_KEY` = your OpenRouter API key
4. No need to change the build output directory (Vercel auto-detects Vite's `dist` folder).
5. Click **Deploy**. Your app will be live on your Vercel domain!

#### Notes
- The `base` config has been removed from `vite.config.ts` for Vercel compatibility.
- If you need custom rewrites or headers, edit `vercel.json`.
- For API keys, always use Vercel's Environment Variables (never commit secrets).

---

For local development, use:
```bash
npm run dev
```
2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# Copy the example environment file
cp .env.example .env

# Edit .env and add your OpenRouter API key
VITE_OPENROUTER_API_KEY=your_actual_openrouter_api_key_here
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

## 🔑 API Key Setup

1. Visit [OpenRouter](https://openrouter.ai/) and create an account
2. Generate an API key from your dashboard
3. Copy the API key to your `.env` file:
   ```bash
   VITE_OPENROUTER_API_KEY=sk-or-v1-your-actual-key-here
   ```
4. Restart your development server

**⚠️ Important: Never commit your `.env` file to version control. The `.gitignore` file is already configured to exclude it.**

## 📜 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint
- `npm run deploy` - Deploy to GitHub Pages

## 🌐 Deployment to GitHub Pages

This project is configured for automatic deployment to GitHub Pages:

1. **Automatic Deployment**: 
   - Push to the `main` branch triggers automatic deployment
   - The build process runs via GitHub Actions
   - Your site will be available at `https://yourusername.github.io/DeathChat/`

2. **Manual Deployment**:
   ```bash
   npm run build
   npm run deploy
   ```

3. **Configure GitHub Pages**:
   - Go to your repository settings
   - Navigate to "Pages" section
   - Select "GitHub Actions" as the source

## 🎨 Features Overview

### Chat Interface
- **Sidebar Navigation**: Create and manage multiple conversations
- **Message Formatting**: Support for code blocks, lists, headers, and styling
- **Copy Functionality**: Easy copy-to-clipboard for AI responses
- **Responsive Design**: Seamless experience across all devices

### AI Integration
- **DeepSeek Model**: Fast and intelligent AI responses
- **Context Awareness**: Maintains conversation context
- **Error Handling**: Graceful error management and user feedback
- **Typing Indicators**: Visual feedback during AI processing

### Storage & Performance
- **Local Storage**: Conversations persist between sessions
- **Optimized Loading**: Fast initial load and smooth interactions
- **Memory Efficient**: Efficient state management and updates

## 🔧 Project Structure

```
DeathChat/
├── .github/workflows/    # GitHub Actions deployment
├── src/
│   ├── components/      # React components
│   ├── services/        # API services
│   └── styles/          # CSS modules
├── public/              # Static assets
├── .env.example         # Environment template
└── vite.config.ts       # Vite configuration
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [OpenRouter](https://openrouter.ai/) - AI API provider
- [DeepSeek](https://deepseek.com/) - AI model
- [Tailwind CSS](https://tailwindcss.com/) - Styling framework
- [Vite](https://vitejs.dev/) - Build tool

## 📧 Contact

**SDeath-Scythe** - [Portfolio](https://sdeath-scythe.github.io/3d-portfolio/)

Project Link: [https://github.com/SDeath-Scythe/DeathChat](https://github.com/SDeath-Scythe/DeathChat)

This project is configured for automatic deployment to GitHub Pages using GitHub Actions.

### Automatic Deployment

1. Push your code to the `main` branch
2. GitHub Actions will automatically build and deploy your app
3. Your app will be available at `https://yourusername.github.io/chatBotAI/`

### Manual Deployment

You can also deploy manually using:
```bash
npm run deploy
```

## Configuration for GitHub Pages

Update the following in `package.json`:
```json
{
  "homepage": "https://yourusername.github.io/chatBotAI"
}
```

Update the `base` in `vite.config.ts`:
```typescript
export default defineConfig({
  base: '/chatBotAI/', // Replace with your repository name
})
```

## Project Structure

```
chatBotAI/
├── public/
├── src/
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── .github/
│   └── workflows/
│       └── deploy.yml
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.ts
└── README.md
```

## Customization

### Tailwind CSS

Customize your design system in `tailwind.config.js`. The project includes:
- Responsive design utilities
- Color schemes
- Typography
- Spacing and layout utilities

### Components

Add your React components in the `src/` directory. The project is set up with:
- TypeScript for type safety
- Modern React patterns
- CSS modules support

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).
