# Security Guidelines

## 🔐 API Key Management

### Environment Variables
- **NEVER** commit your `.env` file to version control
- Use `.env.example` as a template for other developers
- Store your actual API key in `.env` locally
- Use environment variables in production (GitHub Secrets for Actions)

### OpenRouter API Key
- Keep your API key secure and private
- Regenerate your key if you suspect it's been compromised
- Monitor your API usage on the OpenRouter dashboard
- Set spending limits to prevent unexpected charges

## 🛡️ Best Practices

### Local Development
1. Copy `.env.example` to `.env`
2. Add your actual API key to `.env`
3. Never share your `.env` file
4. The `.gitignore` file excludes `.env` from version control

### Production Deployment
- For GitHub Pages, the API key is bundled in the build
- Consider using a backend proxy for additional security
- Monitor API usage and set rate limits
- Use environment-specific API keys

### Repository Security
- `.env` is ignored by git (check `.gitignore`)
- Only `.env.example` is committed (without real keys)
- All sensitive data excluded from version control

## 🚨 What to do if your API key is compromised

1. **Immediately** regenerate your API key at OpenRouter
2. Update your local `.env` file with the new key
3. Redeploy your application if the old key was in production
4. Review API usage logs for any unauthorized activity

## ✅ Security Checklist Before Publishing

- [ ] `.env` is in `.gitignore`
- [ ] No API keys in source code
- [ ] `.env.example` has placeholder values only
- [ ] README includes security instructions
- [ ] All commits checked for sensitive data

## 📞 Reporting Security Issues

If you discover a security vulnerability, please email the maintainer directly rather than opening a public issue.
