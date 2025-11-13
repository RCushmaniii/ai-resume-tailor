# AI Resume Tailor

**Free AI-Powered Resume Analysis Tool**

Get instant feedback on how well your resume matches any job description. Powered by OpenAI GPT-4.

---

## Features

**Instant Analysis** - Get results in under 60 seconds  
**Match Score** - See your 0-100 compatibility score  
**Missing Keywords** - Discover what ATS systems are looking for  
**Smart Suggestions** - Get actionable improvements  
**Privacy First** - Your data is never stored

---

## How It Works

1. **Paste Your Resume** - Copy your current resume text
2. **Add Job Description** - Paste the job posting you're targeting
3. **Get Analysis** - Receive instant AI-powered feedback
4. **Improve & Apply** - Use suggestions to optimize your resume

---

## What You'll Get

### Match Score Breakdown
- **Keyword Overlap** - How many required skills you have
- **Semantic Match** - Overall relevance to the role
- **Structure Score** - Resume completeness and formatting

### Missing Keywords
Prioritized list of skills and keywords from the job description that aren't in your resume:
- **High Priority** - Critical requirements
- **Medium Priority** - Important but not essential
- **Low Priority** - Nice-to-have skills

### Improvement Suggestions
3-5 specific, actionable recommendations to strengthen your resume for this specific job.

---

## Privacy & Security

- ✅ **No Account Required** - Use immediately, no signup
- ✅ **No Data Storage** - Analysis happens in real-time, nothing saved
- ✅ **Secure Processing** - All data encrypted in transit
- ✅ **Input Validation** - Protected against malicious content

---

## Technology Stack

### Frontend
- **React** with TypeScript
- **Vite** for blazing-fast builds
- **TailwindCSS** for modern styling
- **Recharts** for data visualization
- **Sonner** for toast notifications

### Backend
- **Flask** Python web framework
- **OpenAI GPT-4** for AI analysis
- **Gunicorn** production server
- **CORS** enabled for security

---

## Documentation

- **[Quick Start](./src/docs/quick_start.md)** - Get up and running
- **[Template Usage](./src/docs/template_usage.md)** - How to use this template
- **[Mobile Responsive](./src/docs/mobile_responsiveness.md)** - Mobile design guide
- **[Coding Principles](./src/docs/core_coding_principals.md)** - Development standards
- **[Changelog](./src/docs/changelog.md)** - Version history
- **[PRD](./src/docs/prd.md)** - Product requirements
- **[Next Steps](./src/docs/next_steps.md)** - Future roadmap

---

## Contributing

This is an open-source project. Contributions are welcome!

### Development Setup

```bash
# Clone the repository
git clone https://github.com/RCushmaniii/ai-resume-tailor

# Install frontend dependencies
cd client
pnpm install

# Install backend dependencies
cd ../server
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Add your OPENAI_API_KEY to .env

# Start development servers
# Terminal 1 - Frontend
cd client
pnpm dev

# Terminal 2 - Backend
cd server
python app.py
```

---

## License

This project is licensed under the MIT License.

---

## Acknowledgments

- **OpenAI** for GPT-4 API
- **React** and **Vite** communities
- **TailwindCSS** for the design system
- All contributors and users

---

## Contact

- **GitHub**: [RCushmaniii/ai-resume-tailor](https://github.com/RCushmaniii/ai-resume-tailor)
- **Issues**: [Report a bug](https://github.com/RCushmaniii/ai-resume-tailor/issues)

---

**Built with ❤️ for job seekers everywhere**

*Powered by AI • Free Forever*
