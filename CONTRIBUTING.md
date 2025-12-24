# Contributing to AI Resume Tailor

Thank you for your interest in contributing! This guide will help you get started.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm/pnpm
- Python 3.11+ and pip
- Git

### Development Setup

1. **Clone and navigate**

   ```bash
   git clone https://github.com/RCushmaniii/ai-resume-tailor.git
   cd ai-resume-tailor
   ```

2. **Backend setup**

   ```bash
   cd server
   python -m venv venv
   venv\Scripts\activate  # On Windows
   pip install -r requirements.txt
   cp .env.example .env  # Add your API keys
   ```

3. **Frontend setup**

   ```bash
   cd ../client
   npm install
   cp .env.example .env  # Configure API URL
   ```

4. **Start development**

   ```bash
   # Option 1: Use the batch file (Windows)
   START_DEV.bat

   # Option 2: Manual startup
   # Backend (port 5000)
   cd server && venv\Scripts\activate && python app.py

   # Frontend (port 3000)
   cd client && npm run dev
   ```

## 📋 Project Structure

```
ai-resume-tailor/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── i18n/          # Translations (en/es)
│   │   └── lib/           # Utilities
│   └── package.json
├── server/                 # Flask backend
│   ├── app.py             # Main Flask application
│   ├── ai_engine/         # AI analysis logic
│   └── requirements.txt
├── docs/                  # Documentation
└── .windsurf/             # Cascade configuration
```

## 🛠️ Development Guidelines

### Code Style

- **Frontend**: TypeScript, ESLint, Prettier (auto-formatted)
- **Backend**: Python, PEP 8 style
- **Components**: Follow existing patterns and shadcn/ui conventions

### Internationalization

- All new UI text must include i18n keys
- Update both `en.ts` and `es.ts` translation files
- Test both languages before submitting

### Security

- Validate all inputs on both frontend and backend
- Sanitize data before AI API calls
- Never expose API keys in client code

## 🐛 Bug Reports

When reporting bugs, please include:

- **Environment**: OS, browser, Node.js/Python versions
- **Steps to reproduce**: Clear reproduction steps
- **Expected vs actual**: What you expected vs what happened
- **Screenshots**: If applicable

## ✨ Feature Requests

- **Use cases**: Describe the problem you're solving
- **Proposed solution**: How you envision the feature
- **Alternatives**: Other approaches you considered
- **Impact**: Why this feature matters

## 📝 Submitting Changes

1. **Create a branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make changes**
   - Follow existing code patterns
   - Add tests if applicable
   - Update documentation

3. **Test thoroughly**

   ```bash
   # Frontend
   npm run build
   npm run lint

   # Backend
   python -m py_compile app.py
   ```

4. **Commit and push**

   ```bash
   git add .
   git commit -m "feat: add your feature description"
   git push origin feature/your-feature-name
   ```

5. **Create Pull Request**
   - Use clear title and description
   - Link relevant issues
   - Request review from maintainers

## 🎯 Areas for Contribution

### High Impact

- **AI Prompts**: Improve analysis quality and accuracy
- **UI/UX**: Enhance user experience and accessibility
- **Performance**: Optimize API calls and frontend rendering
- **Internationalization**: Add new languages or improve translations

### Good First Issues

- **Documentation**: Improve README and guides
- **Bug Fixes**: Address reported issues
- **Testing**: Add unit or integration tests
- **Components**: Create reusable UI components

## 🏆 Recognition

Contributors are recognized in:

- **README.md**: Contributor list with links
- **Release notes**: Feature attributions
- **GitHub**: Badges and achievements

## 📞 Get Help

- **Issues**: Create GitHub issue for bugs/questions
- **Discussions**: Use GitHub Discussions for ideas
- **Documentation**: Check existing docs first
- **Code Review**: We're happy to review work in progress

---

Thank you for contributing to AI Resume Tailor! 🎉
