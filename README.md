# AI Resume Tailor (LatAm Edition)

**Last Updated:** November 5, 2025

Paste your resume and job description—get instant, ATS-aware, plain-English fixes tailored for non-native English speakers (e.g., engineers in Mexico applying to U.S./multinational roles).

---

## ✨ MVP Features

🎯 **Instant Analysis** - Paste resume + job description, get results in ≤8 seconds  
📊 **Match Score** - 0-100 score with detailed breakdown  
🔍 **Missing Keywords** - Prioritized list with context from JD  
✍️ **Smart Suggestions** - 5-8 targeted rewrites with rationale  
🌎 **LatAm Focused** - Guidance for non-native English speakers  
🔒 **Privacy First** - No server-side storage, process in memory

---

## 📸 Screenshots

### Template Preview

![Template Preview](./public/sreenshot1.jpg)

### Interactive Appointment Booking

![Appointment Booking System](./public/sreenshot2.jpg)

### Data Visualization Dashboard

![Dashboard with Charts](./public/sreenshot3.jpg)

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and pnpm
- Python 3.9+

### Installation

```bash
# Install client dependencies
pnpm install

# Set up Python virtual environment and install server dependencies
cd server
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Mac/Linux
pip install -r requirements.txt
python -m spacy download en_core_web_sm
cd ..
```

### Development

```bash
# Terminal 1: Start Flask backend (port 5000)
pnpm dev:server

# Terminal 2: Start React frontend (port 3000)
pnpm dev:client
```

Open `http://localhost:3000` in your browser.

### Test the Connection

Visit `http://localhost:3000/test-api` to verify the frontend can communicate with the backend.

---

## 📚 Documentation

Detailed documentation is available in the [`/docs`](./docs) folder:

- **[Setup Guide](./docs/SETUP.md)** - Complete installation and configuration
- **[Phase 0 Summary](./docs/PHASE_0_COMPLETE.md)** - Project scaffold completion
- **[GitHub Setup](./docs/GITHUB_SETUP.md)** - Repository configuration
- **[SEO Guide](./docs/SEO_SETUP.md)** - SEO optimization

---

## 🎯 Tech Stack

### Frontend (`/client`)

- **React 19** + **TypeScript 5.8** - Type-safe UI
- **Vite 7** - Lightning-fast dev server
- **Tailwind CSS 3.4** + **ShadCN UI** - Beautiful, accessible components
- **Zustand** - Lightweight state management
- **TanStack Query** - Server state & caching
- **React Router v6** - Client-side routing
- **Lucide React** - Modern icons

### Backend (`/server`)

- **Flask 3.0** - Lightweight Python API
- **Flask-CORS** - Cross-origin support
- **spaCy 3.7** - NLP for keyword extraction
- **OpenAI API** - GPT-4 for suggestions
- **python-dotenv** - Environment management

---

## 📦 Project Structure

```
ai-resume-tailor/
├── client/              # React frontend
│   ├── src/
│   │   ├── components/  # UI components
│   │   ├── features/    # Feature modules (future)
│   │   ├── lib/         # Utilities
│   │   └── pages/       # Page components
│   ├── package.json
│   └── vite.config.ts   # Vite + API proxy config
├── server/              # Flask backend
│   ├── app.py           # Main Flask app
│   ├── requirements.txt # Python dependencies
│   ├── .env.example     # Environment template
│   ├── setup.bat        # Windows setup script
│   └── venv/            # Python virtual env (gitignored)
├── docs/                # 📚 Documentation
│   ├── README.md        # Documentation index
│   ├── SETUP.md         # Setup guide
│   ├── PHASE_0_COMPLETE.md  # Phase 0 summary
│   ├── GITHUB_SETUP.md  # GitHub setup
│   └── SEO_SETUP.md     # SEO guide
├── package.json         # Root workspace scripts
├── pnpm-workspace.yaml  # pnpm workspace config
├── START_DEV.bat        # Quick start script (Windows)
└── .env.example         # Environment template
```

---

## 🎨 Available Components (ShadCN UI)

- ✅ **Accordion** - Collapsible content sections
- ✅ **Alert** - Contextual feedback messages
- ✅ **Avatar** - User profile images with fallbacks
- ✅ **Badge** - Status indicators and labels
- ✅ **Button** - Multiple variants (default, outline, ghost, etc.)
- ✅ **Calendar** - Date picker with range selection
- ✅ **Card** - Content containers
- ✅ **Dialog** - Modal dialogs
- ✅ **Input** - Form inputs
- ✅ **Label** - Form labels
- ✅ **Progress** - Progress indicators
- ✅ **Select** - Dropdown selections
- ✅ **Separator** - Visual dividers
- ✅ **Slider** - Range inputs
- ✅ **Switch** - Toggle switches
- ✅ **Tabs** - Tabbed interfaces

---

## 🎨 Interactive Components Showcase

Visit `/components` to see a **fully functional appointment booking system** with real-time interactions!

### 📅 Appointment Booking System

A complete booking flow demonstrating ShadCN UI components in action:

- **Service Selection** - Dropdown with pricing and duration
- **Calendar Integration** - Date picker with disabled past dates
- **Time Slot Selection** - Interactive time slot buttons with availability
- **Duration Slider** - Adjustable appointment length (15-120 min)
- **User Information Form** - Name and email inputs with validation
- **Email Reminders** - Toggle switch for notifications
- **Booking Summary** - Real-time summary with pricing calculations
- **Confirmation Dialog** - Beautiful modal with animations, icons, and avatar

### 📊 Data Visualization Dashboard

Professional charts and statistics:

- **Stat Cards** - Revenue, Bookings, Active Clients, Avg. Session (with trend indicators)
- **Area Chart** - Revenue & Bookings trend over 6 months
- **Pie Chart** - Service distribution breakdown with percentages
- **Bar Chart** - Weekly appointment activity
- **Responsive Design** - All charts optimized for mobile devices

**Live Demo:** Run `pnpm dev` and visit `http://localhost:3000/components`

---

## 🛠️ Available Scripts

```bash
# Development
pnpm dev              # Start dev server
pnpm build            # Build for production
pnpm preview          # Preview production build

# Code Quality
pnpm lint             # Run ESLint
pnpm lint:fix         # Fix ESLint errors
pnpm typecheck        # Run TypeScript checks
pnpm format           # Format with Prettier
pnpm verify           # Run all checks + build

# Utilities
pnpm msw:init         # Initialize MSW
pnpm init:template    # Run template initialization script
```

---

## 🎨 Design Principles

This template follows modern web development best practices:

### Mobile-First Design

- Responsive layouts starting from mobile (320px+)
- Touch-friendly interactive elements
- Optimized for tablets and desktop

### Accessibility

- Semantic HTML structure
- ARIA labels and roles
- Keyboard navigation support
- Screen reader friendly

### Performance

- Code splitting and lazy loading
- Optimized bundle sizes
- Fast page loads with Vite
- Efficient re-renders

### Code Quality

- **SRP** (Single Responsibility Principle)
- **DRY** (Don't Repeat Yourself)
- **SoC** (Separation of Concerns)
- Immutable state patterns
- Graceful error handling

---

## 🔧 Configuration

### Path Aliases

```typescript
import { Button } from '@/components/ui/button';
import { utils } from '@/lib/utils';
```

### Tailwind Configuration

- Custom color schemes
- Typography plugin
- Animation utilities
- Dark mode support

### TypeScript

- Strict mode enabled
- Path mapping configured
- Full type coverage

---

## 📱 Responsive Breakpoints

```css
sm:  640px   /* Small devices (tablets) */
md:  768px   /* Medium devices (small laptops) */
lg:  1024px  /* Large devices (desktops) */
xl:  1280px  /* Extra large devices */
2xl: 1536px  /* 2X large devices */
```

Max container width: **7xl (80rem / 1280px)**

---

## 🎯 Use Cases

This template is perfect for:

- ✅ SaaS applications
- ✅ Admin dashboards
- ✅ Booking/scheduling systems
- ✅ Data visualization apps
- ✅ Component libraries
- ✅ Marketing websites
- ✅ Portfolio sites

---

## 📝 License

MIT License - feel free to use this template for personal or commercial projects.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📬 Contact

**Robert Cushman**

- GitHub: [@RCushmaniii](https://github.com/RCushmaniii)
- Repository: [react-vite-tailwind-base](https://github.com/RCushmaniii/react-vite-tailwind-base)

---

## ⭐ Show Your Support

Give a ⭐️ if this project helped you!

---

**Built with ❤️ using React, Vite, Tailwind CSS, and ShadCN UI**
