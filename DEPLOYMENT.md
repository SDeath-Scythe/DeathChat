# 🚀 DeathChat - Deployment Status

## Live Application
**🌐 URL:** https://sdeath-scythe.github.io/DeathChat/

## 📋 Setup Instructions for Users

### Quick Start
1. **Visit the live application** at the URL above
2. **You'll see an error initially** - this is expected! You need an API key.
3. **Get your API key:**
   - Go to [OpenRouter.ai](https://openrouter.ai/)
   - Create a free account
   - Generate an API key from your dashboard

### 🔑 Setting Up Your API Key

Since this is a client-side application, you'll need to set up your API key locally:

#### Option 1: Local Development
```bash
# Clone the repository
git clone https://github.com/SDeath-Scythe/DeathChat.git
cd DeathChat

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Edit .env and add your API key:
# VITE_OPENROUTER_API_KEY=your_actual_api_key_here

# Run locally
npm run dev
```

#### Option 2: Deploy Your Own Version
1. Fork the repository
2. Add your API key as a GitHub Secret named `VITE_OPENROUTER_API_KEY`
3. Update the GitHub Actions workflow to use the secret
4. Enable GitHub Pages on your fork

## ⚠️ Important Security Note

The live demo at the GitHub Pages URL **will not work** without an API key. For security reasons, no API key is included in the public deployment. Users must:

- Run the application locally with their own API key, OR
- Deploy their own version with their API key

## 🛠️ Features

- ✅ **Responsive Design** - Works on all devices
- ✅ **Dark Theme** - Professional UI with animations
- ✅ **Conversation Management** - Multiple chat sessions
- ✅ **Local Storage** - Conversations persist
- ✅ **Copy Functionality** - Easy message copying
- ✅ **Markdown Support** - Rich text formatting

## 📱 Mobile Responsive

The application is fully optimized for:
- 📱 Mobile phones (320px+)
- 📱 Tablets (768px+) 
- 💻 Laptops (1024px+)
- 🖥️ Desktop (1280px+)

## 🔧 Technical Stack

- ⚡ **Vite + React 18**
- 🎨 **Tailwind CSS**
- 🤖 **OpenRouter API (DeepSeek)**
- 📱 **Responsive Design**
- 🚀 **GitHub Pages Deployment**

---

**Repository:** https://github.com/SDeath-Scythe/DeathChat  
**Creator:** [SDeath-Scythe](https://sdeath-scythe.github.io/3d-portfolio/)
