# ChatBot AI

A modern React application built with TypeScript and Tailwind CSS, ready for deployment to GitHub Pages.

## Features

- ⚡ **Vite** - Fast build tool and development server
- ⚛️ **React 18** - Latest React with TypeScript support
- 🎨 **Tailwind CSS** - Utility-first CSS framework
- 📱 **Responsive Design** - Mobile-first approach
- 🚀 **GitHub Pages Ready** - Automatic deployment workflow
- 🔧 **ESLint** - Code linting and formatting

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/chatBotAI.git
cd chatBotAI
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint
- `npm run deploy` - Deploy to GitHub Pages (manual)

## Deployment to GitHub Pages

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
