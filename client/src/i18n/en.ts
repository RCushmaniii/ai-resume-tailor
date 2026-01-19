export const en = {
  app: {
    loading: "Loading...",
  },
  seo: {
    landing: {
      title: "AI Resume Tailor - Get Your Resume Past ATS in Seconds",
      description:
        "AI-powered resume analysis tool. Get instant match scores, missing keywords, and actionable suggestions to optimize your resume for any job. No signup required.",
      keywords:
        "resume analyzer, ATS checker, resume optimization, AI resume tool, job application, resume keywords, free resume checker, resume match score",
      canonical: "https://airesumatailor.com",
    },
    analyze: {
      title: "Analyze Your Resume - AI Resume Tailor",
      description:
        "Get instant AI-powered analysis of your resume against any job description. See your match score, missing keywords, and improvement suggestions.",
      keywords: "resume analysis, ATS score, resume checker, job match, resume keywords, AI analysis",
      canonical: "https://airesumatailor.com/analyze",
    },
  },
  language: {
    toggleLabel: "Language",
  },
  header: {
    logoAlt: "AI Resume Tailor Logo",
    tagline: "AI-Powered Resume Analysis",
    toasts: {
      signOutFailed: "Sign out failed",
      signedOut: "Signed out",
    },
    nav: {
      analyze: "Analyze Resume",
      forRecruiters: "For Recruiters",
      howItWorks: "How It Works",
      docs: "Docs",
      privacy: "Privacy",
      documentation: "Documentation",
    },
    auth: {
      signedIn: "Signed in",
      signIn: "Sign in",
      signOut: "Sign out",
    },
  },
  authDialog: {
    title: "Account",
    description: "Sign in to save analyses and get more credits.",
    supabaseNotConfigured: "Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY.",
    tabs: {
      signIn: "Sign in",
      signUp: "Sign up",
    },
    fields: {
      email: "Email",
      password: "Password",
    },
    actions: {
      signIn: "Sign in",
      signUp: "Create account",
    },
    status: {
      working: "Working...",
    },
    toasts: {
      signedIn: "Signed in",
      signInFailed: "Sign in failed",
      signUpConfirm: "Check your email to confirm",
      signUpFailed: "Sign up failed",
    },
  },
  common: {
    clear: "Clear",
  },
  fileUpload: {
    extracting: "Extracting text...",
    charactersExtracted: "characters extracted",
    successMessage: "Resume text extracted successfully!",
    reviewHint: "Your text is ready below. Feel free to review and edit before analyzing.",
    failed: "Upload failed",
    tryAgain: "Try again",
    uploadFile: "Upload a file",
    orDragDrop: "or drag and drop",
    supportedFormats: "PDF or DOCX up to 5MB",
    clear: "Clear file",
    dropZoneLabel: "Upload resume file",
    errors: {
      unsupportedFormat: "Please upload a PDF or DOCX file.",
      fileTooLarge: "File is too large. Maximum size is 5MB.",
      emptyFile: "File is empty.",
      parseError: "Failed to parse file. Please try copy-pasting your resume text instead.",
    },
  },
  analyze: {
    heading: "AI Resume Tailor",
    subheading: "Analyze how well your resume matches the job description",
    selectRole: "Don't have a file handy? Click a role to load sample data:",
    resumeLabel: "Your Resume",
    jobLabel: "Job Description",
    resumePlaceholder: "Paste your resume text here (Ctrl+V). Don't worry about formatting—our AI handles bullet points and columns automatically.",
    jobPlaceholder: "Paste the job posting here...",
    characters: "characters",
    clear: "Clear text",
    clearText: "Clear text",
    pasteText: "Paste",
    uploadFile: "Upload",
    extractedText: "Extracted text preview",
    extractionSuccess: "Resume text extracted successfully!",
    extractionHint: "Review your text below and make any edits before analyzing.",
    analyzing: "Analyzing...",
    pasteBothToStart: "Paste Both Texts to Start",
    analyzeMatch: "Analyze Match Now",
    results: {
      score: {
        excellent: "Excellent Match",
        good: "Good Match",
        needsWork: "Needs Improvement",
        context: "Job Alignment Score",
      },
      keywords: {
        missingTitle: "Missing Keywords",
        missingContext: "Adding these terms can improve your job alignment score.",
        allFoundTitle: "Great Job!",
        allFoundDesc: "We found all critical keywords in your resume.",
        missing: "Missing Keywords",
        noMissing: "None - Great job!",
        found: "Found Keywords",
      },
      metrics: {
        hardSkills: "Keyword Presence",
        semantic: "Job Alignment",
        tone: "Resume Quality",
      },
      atsScan: "Keyword Scan Results",
      missingKeywords: "Missing Keywords",
      foundKeywords: "Found Keywords",
      noMissing: "None - Great job!",
      detailedScoring: "Detailed Scoring Breakdown",
      optimizationPlan: "Optimization Plan",
      noGapsTitle: "Excellent Match!",
      noGapsDescription: "Your resume strongly matches the job requirements. No critical gaps were identified.",
      suggestions: {
        title: "Optimization Plan",
        subtitle: "Actionable recommendations to strengthen your resume.",
        perfectTitle: "No Improvements Needed!",
        perfectDesc: "Your resume aligns perfectly with the job description based on our analysis.",
      },
      nextStepTitle: "Ready to improve your score?",
      nextStepDesc: "Edit your resume based on these suggestions and analyze again.",
      reportTitle: "Analysis Report",
      editButton: "Edit & Optimize",
      analyzeAgain: "Analyze Again",
    },
    toasts: {
      freeLimitReachedTitle: "Free analyses used",
      analysisCompleteTitle: "Analysis complete",
      analysisFailedTitle: "Analysis Failed",
    },
    messages: {
      freeLimitReached: "You've used all {{total}} free analyses. Sign up for more!",
      freeRemaining: "Free analyses remaining: {{remaining}} / {{total}}.",
      creditsRemaining: "Credits remaining: {{remaining}} / {{total}}.",
      analysisFailedGeneric: "Analysis failed. Please try again.",
      requestTimedOut: "Request timed out. Please try again.",
    },
  },
  apiErrors: {
    AUTH_MISSING_BEARER_TOKEN: "You’re not signed in.",
    AUTH_INVALID_TOKEN: "Your session expired. Please sign in again.",
    AUTH_VALIDATION_FAILED: "We couldn’t validate your session. Please try again.",

    ANALYZE_NO_DATA: "Please provide resume and job description text.",
    ANALYZE_RESUME_REQUIRED: "Resume text is required.",
    ANALYZE_JOB_REQUIRED: "Job description text is required.",
    ANALYZE_RESUME_SUSPICIOUS: "Invalid content detected in your resume. Please provide plain text only.",
    ANALYZE_JOB_SUSPICIOUS: "Invalid content detected in the job description. Please provide plain text only.",
    ANALYZE_RESUME_TOO_SHORT: "Resume text is too short (minimum {{min_length}} characters).",
    ANALYZE_JOB_TOO_SHORT: "Job description text is too short (minimum {{min_length}} characters).",
    ANALYZE_RESUME_TOO_LONG: "Resume text is too long (maximum {{max_length}} characters).",
    ANALYZE_JOB_TOO_LONG: "Job description text is too long (maximum {{max_length}} characters).",
    ANALYZE_CREDITS_EXCEEDED_REGISTERED: "You’ve used all your credits.",
    ANALYZE_CREDITS_EXCEEDED_GUEST: "You’ve used your free limit. Create a free account to continue.",

    INTERNAL_ERROR: "Server error. Please try again.",
  },
  landing: {
    hero: {
      badge: "AI-Powered Analysis",
      headlinePrefix: "Get Your Resume Past the",
      headlineAts: "ATS in Seconds",
      headlineSuffix: "",
      subheadlinePrefix: "AI-powered analysis shows exactly what recruiters want to see.",
      subheadlineEmphasis: "No signup required.",
      cta: "Analyze My Resume Free",
      socialProofPrefix: "Used by",
      socialProofHighlight: "10,000+",
      socialProofSuffix: "job seekers",
      heroImageAlt: "Professional resume analysis",
      floatingBadgeMatch: "85% Match",
      floatingBadgeLabel: "Average Score",
    },
    problem: {
      heading: "Why Aren’t You Getting Interviews?",
      subheading: "Even qualified candidates struggle to get past the first filter",
      cards: {
        atsRejection: {
          title: "ATS Rejection",
          description:
            "75% of resumes get auto-rejected by applicant tracking systems before a human ever sees them.",
        },
        missingKeywords: {
          title: "Missing Keywords",
          description:
            "Recruiters scan for specific terms. Without them, your resume goes straight to the \"no\" pile.",
        },
        takesTooLong: {
          title: "Takes Too Long",
          description:
            "Customizing your resume for each job posting wastes hours you could spend networking.",
        },
      },
    },
    features: {
      heading: "Your AI-Powered Resume Coach",
      subheading: "Everything you need to optimize your resume and land more interviews",
      cards: {
        matchScore: {
          title: "Instant Match Score",
          description: "Know exactly where you stand with a 0-100% compatibility score in seconds.",
        },
        missingKeywords: {
          title: "Missing Keywords",
          description: "See exactly what recruiters are looking for with priority-ranked keywords.",
        },
        analysis3Part: {
          title: "3-Part Analysis",
          description: "Get detailed breakdowns: Keywords • Semantic Match • Tone & Style.",
        },
        smartSuggestions: {
          title: "Smart Suggestions",
          description: "Receive 3-5 actionable tips to improve your resume instantly.",
        },
        private: {
          title: "100% Private",
          description: "Nothing is stored or shared. Your data stays completely confidential.",
        },
        free: {
          title: "Always Available",
          description: "No credit card required. No signup needed for basic analysis.",
        },
      },
    },
    howItWorks: {
      heading: "Get Hired Faster in 3 Simple Steps",
      subheading: "From resume to interview-ready in under a minute",
      steps: {
        step1: {
          title: "Paste Resume",
          description: "Copy your resume and the job posting you’re applying to.",
        },
        step2: {
          title: "AI Analyzes",
          description: "GPT-4 compares your resume to job requirements in seconds.",
        },
        step3: {
          title: "Apply Changes",
          description: "Update with missing keywords and actionable improvement tips.",
        },
      },
      cta: "Try It Now Free",
    },
    stats: {
      resumesAnalyzed: "Resumes Analyzed",
      averageMatchScore: "Average Match Score",
      averageAnalysisTime: "Average Analysis Time",
    },
    faq: {
      heading: "Frequently Asked Questions",
      subheading: "Everything you need to know about AI Resume Tailor",
      items: {
        q1: {
          question: "Is my data stored or shared?",
          answer: "Never. We process your resume and job description temporarily to provide the analysis and then immediately discard it. We do not store your data, and we never sell it to third parties.",
        },
        q2: {
          question: "What AI model powers this?",
          answer: "We use GPT-4, the industry-leading language model, to ensure your resume analysis is accurate, context-aware, and matches human-level understanding of job requirements.",
        },
        q3: {
          question: "Does it work for all industries?",
          answer: "Yes. Because our AI analyzes the semantic meaning of your text, it works for everything from Software Engineering and Marketing to Healthcare and Construction.",
        },
        q4: {
          question: "How accurate is the analysis?",
          answer: "Our system mimics the exact keyword-matching algorithms used by modern Applicant Tracking Systems (ATS). While no tool guarantees a job offer, hitting a high match score significantly increases your chances of being seen by a human recruiter.",
        },
        q5: {
          question: "Can I analyze multiple resumes?",
          answer: "Yes. You can run as many analyses as you need to tailor your resume for different job applications.",
        },
        q6: {
          question: "Do I need to create an account?",
          answer: "No. Just paste your resume and the job description and get instant analysis. No registration, no email required.",
        },
      },
    },
    finalCta: {
      badge: "Start Your Job Search Journey",
      heading: "Ready to Land Your Dream Job?",
      subheadlineLine1: "Analyze your resume in 60 seconds.",
      subheadlineLine2: "It’s free, private, and instant.",
      cta: "Analyze My Resume Free",
      trustNoCreditCard: "No Credit Card",
      trustNoSignup: "No Signup Required",
      trustPrivate: "100% Private",
    },
  },
  footer: {
    logoAlt: "AI Resume Tailor logo",
    tagline: "AI-Powered Resume Analysis",
    columns: {
      product: "Product",
      resources: "Resources",
      legal: "Legal",
    },
    links: {
      analyze: "Analyze Resume",
      howItWorks: "How It Works",
      features: "Features",
      faq: "FAQ",
      documentation: "Documentation",
      methodology: "Our Methodology",
      resumeTips: "Resume Tips",
      atsGuide: "ATS Guide",
      github: "GitHub",
      privacy: "Privacy Policy",
      terms: "Terms of Service",
      cookiePolicy: "Cookie Policy",
      support: "Support",
    },
    copyright: " 2023 AI Resume Tailor. All Rights Reserved.",
  },
  docs: {
    nav: {
      index: "Docs Index",
      quickStart: "Quick Start",
      prd: "PRD",
      roadmap: "Roadmap",
      setup: "Setup",
      security: "Security",
      testing: "Testing",
      deployment: "Deployment",
      templateUsage: "Template Usage",
      mobileResponsiveness: "Mobile Responsiveness",
      codingPrinciples: "Coding Principles",
      changelog: "Changelog",
      phase0: "Phase 0",
      phase2: "Phase 2",
    },
    loading: "Loading document...",
    errorPrefix: "Error: {{message}}",
    errors: {
      loadFailed: "Could not load {{filePath}}. Status: {{status}}",
      parsing: "Error parsing markdown content",
      unknown: "An unknown error occurred.",
      markdownExpectedHtml:
        "Expected markdown but received HTML for {{filePath}}. This usually means the doc file is not being served (SPA fallback). Restart the dev server so /docs syncs into client/public/docs.",
    },
  },
  legal: {
    privacy: {
      title: "Privacy Policy",
    },
    terms: {
      title: "Terms of Service",
    },
    lastUpdatedLabel: "Last updated:",
    footer: {
      contact: "If you have any questions about these {{title}}, please contact us.",
    },
  },
  markdown: {
    errors: {
      unknown: "An unknown error occurred.",
    },
    errorPrefix: "Error: {{message}}",
  },
  notFound: {
    title: "Page Not Found",
    description: "Oops! The page you're looking for doesn't exist or has been moved to a new location.",
    actions: {
      goBack: "Go Back",
      returnHome: "Return Home",
    },
    popular: {
      title: "Popular Pages",
      description: "Here are some pages you might be looking for",
      pages: {
        home: "Home",
        analyze: "Analyze",
        docs: "Documentation",
      },
    },
    search: {
      title: "Looking for something specific?",
      description: "Try searching our documentation",
      placeholder: "Search documentation...",
    },
  },
  testApi: {
    title: "API Test Page",
    description: "Test the connection between React frontend and Flask backend",
    health: {
      title: "Health Check Endpoint",
      description: "Test GET /api/health to verify backend is running",
      action: "Test Health Endpoint",
    },
    analyze: {
      title: "Analyze Endpoint",
      description: "Test POST /api/analyze with mock resume data",
      action: "Test Analyze Endpoint",
    },
    alerts: {
      errorTitle: "Error",
      successTitle: "Success!",
      backendResponded: "Backend responded:",
      backendRunningHint: "Make sure Flask backend is running on port 5000",
    },
    instructions: {
      title: "Instructions:",
      steps: {
        startBackend: "Start Flask backend",
        startFrontend: "Start React frontend",
        clickButtons: "Click the buttons above to test API endpoints",
      },
    },
  },
  examples: {
    title: "React Vite Tailwind Examples",
    description: "This page demonstrates various features of the template.",
    sections: {
      uiDemo: {
        title: "UI Component Demonstration",
        description: "This example shows a reusable React component with TypeScript props and Tailwind CSS styling.",
        exampleTitle: "Example Component",
        exampleDescription: "This is an example component with TypeScript props and Tailwind styling",
      },
      apiSingle: {
        title: "Basic API Integration",
        description: "This example demonstrates fetching a single user from a mock API endpoint using MSW.",
        userProfile: "User Profile",
        id: "ID:",
        name: "Name:",
        loadingUser: "Loading user data...",
      },
      apiTable: {
        title: "Data Table with Mock API",
        description: "This example shows how to fetch and display a collection of users from a mock API endpoint.",
        loadingUsers: "Loading users data...",
        headers: {
          id: "ID",
          name: "Name",
          email: "Email",
          role: "Role",
        },
      },
    },
    errorPrefix: "Error: {{message}}",
  },
};