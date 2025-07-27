# 🔑 OpenRouter API Key Setup

## Current Issue: Invalid API Key

Your DeathChat needs a valid OpenRouter API key to work. 

### 📋 Steps to Get a Fresh API Key:

1. **Visit OpenRouter:**
   - Go to [https://openrouter.ai/](https://openrouter.ai/)
   - Click "Sign In" or "Sign Up"

2. **Create Account (if needed):**
   - Use your email or sign in with Google/GitHub
   - Verify your email if required

3. **Get API Key:**
   - Go to [https://openrouter.ai/keys](https://openrouter.ai/keys)
   - Click "Create Key"
   - Give it a name like "DeathChat"
   - Copy the generated key (starts with `sk-or-v1-`)

4. **Update Your .env File:**
   ```env
   VITE_OPENROUTER_API_KEY=sk-or-v1-YOUR_NEW_KEY_HERE
   ```

5. **Restart Development Server:**
   ```bash
   # Stop current server (Ctrl+C)
   # Then restart:
   npm run dev
   ```

### 💡 Free Tier Info:
- OpenRouter offers free credits for new users
- DeepSeek model is free to use
- No credit card required for basic usage

### 🔧 Quick Test:
Once you update the key:
1. Open http://localhost:5173/DeathChat/
2. Type a message and press Enter
3. Check browser console (F12) for any errors

---

**Need help?** The API key should be exactly as shown on OpenRouter, starting with `sk-or-v1-`
