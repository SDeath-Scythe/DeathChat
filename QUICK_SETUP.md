# 🚀 Quick Setup Guide for DeathChat

## ⚠️ API Key Required

Your DeathChat application needs an OpenRouter API key to work properly.

### 📋 Steps to Set Up:

1. **Get your OpenRouter API Key:**
   - Go to [OpenRouter.ai](https://openrouter.ai/)
   - Sign up for a free account
   - Navigate to your API Keys section
   - Copy your API key

2. **Create a .env file:**
   ```bash
   # In your project root directory (d:\salih\chatBotAI\)
   # Create a file named .env (not .env.txt)
   ```

3. **Add your API key to .env:**
   ```env
   VITE_OPENROUTER_API_KEY=your_actual_api_key_here
   ```

4. **Restart your development server:**
   ```bash
   npm run dev
   ```

### 🔒 Security Note:
- Never commit your .env file to git
- The .env file is already in .gitignore for security
- Each user needs their own API key

### ✅ Once configured:
- The chat will work with AI responses
- No more API key errors
- Full functionality restored

---

**Need help?** Check the main README.md for detailed instructions.
